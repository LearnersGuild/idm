import raven from 'raven'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import url from 'url'

import {Strategy as GitHubStrategy} from 'passport-github'
import {extendJWTExpiration} from '@learnersguild/idm-jwt-auth/lib/middlewares'

import {encrypt, decrypt} from 'src/server/symmetricCryptoAES'
import {User} from 'src/server/services/dataService'
import {slackSAMLPost} from './samlSlack'
import {
  mergeUserInfo,
  getUserByGithubId,
  getInviteCodesByCode,
  defaultSuccessRedirect,
  saveUserAvatar,
} from './helpers'

const config = require('src/config')

const sentry = new raven.Client(config.server.sentryDSN)

export function githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails, inviteCode) {
  const inviteCodeData = inviteCode ? {inviteCode: inviteCode.code, roles: inviteCode.roles || []} : {}
  return Object.assign({}, {
    name: profile.displayName || profile.username,
    email: primaryEmail,
    handle: profile.username,
    emails,
    authProviders: {
      githubOAuth2: {accessToken, refreshToken},
    },
    authProviderProfiles: {
      githubOAuth2: profile,
    },
  }, inviteCodeData)
}

function getGitHubEmails(accessToken) {
  return fetch(`https://api.github.com/user/emails?access_token=${accessToken}`).then(resp => resp.json())
}

async function verifyUserFromGitHub(req, accessToken, refreshToken, profile, cb) {
  try {
    let user = await getUserByGithubId(profile.id)

    if (!user || !user.active) {
      return cb(null, false)
    }
    const ghEmails = await getGitHubEmails(accessToken)
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    const userInfo = githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails)
    user = await User
      .get(user.id)
      .updateWithTimestamp(mergeUserInfo(userInfo))
    cb(null, user)
  } catch (err) {
    sentry.captureException(err)
    cb(err)
  }
}

async function createOrUpdateUserFromGitHub(req, accessToken, refreshToken, profile, cb) {
  try {
    const {inviteCode: code} = getAuthState(req)
    let user = await getUserByGithubId(profile.id)
    if (user && !user.active) {
      console.warn(`WARNING: An inactive user attempted to sign up. user=${user.handle} inviteCode=${code}`)
      return cb(null, false)
    }
    const ghEmails = await getGitHubEmails(accessToken)
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    const inviteCode = (await getInviteCodesByCode(code))[0]
    const userInfo = githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails, inviteCode)

    if (user) {
      user = await User
        .get(user.id)
        .updateWithTimestamp(mergeUserInfo(userInfo))
    } else {
      user = await User.save({...userInfo, active: true})
      await saveUserAvatar(user)
    }

    cb(null, user)
  } catch (err) {
    sentry.captureException(err)
    cb(err)
  }
}

function cookieDomain() {
  const urlParts = url.parse(config.app.baseURL)
  return `.${urlParts.hostname}`
}

function saveAuthState(req, res, strategyName) {
  // we use a temporary cookie to store state information relevant to the
  // user's given authentication session
  const authState = Object.assign({strategyName}, req.query)
  const lgAuthState = encrypt(JSON.stringify(authState))
  res.cookie('lgAuthState', lgAuthState, {
    domain: cookieDomain(),
    secure: config.server.secure,
    httpOnly: true
  })
}

function getAuthState(req) {
  const {lgAuthState} = req.cookies
  return JSON.parse(decrypt(lgAuthState))
}

function clearAuthState(res) {
  res.clearCookie('lgAuthState', {domain: cookieDomain()})
}

function authWithGitHub(strategyName) {
  return (req, res) => {
    saveAuthState(req, res, strategyName)
    passport.authenticate(strategyName, {
      scope: ['user', 'repo'],
      approvalPrompt: 'auto',
    })(req, res)
  }
}

function passportAuthCallback(req, res, next) {
  const authState = getAuthState(req)
  // sign-up and sign-in have different strategy names, but use the same OAuth2 app
  const failureRedirect = `/sign-in?redirect=${encodeURIComponent(authState.redirect || defaultSuccessRedirect)}&err=auth`
  return passport.authenticate(authState.strategyName, {failureRedirect})(req, res, next)
}

export function authSuccess(req, res, next) {
  const {redirect, responseType, SAMLRequest, RelayState, inviteCode} = getAuthState(req)
  extendJWTExpiration(req, res)
  clearAuthState(res)

  if (SAMLRequest) {
    return slackSAMLPost(RelayState)(req, res, next)
  }
  return redirectOnSuccess(redirect, responseType, inviteCode)(req, res)
}

function redirectOnSuccess(redirect, responseType, inviteCode) {
  return (req, res) => {
    // sometimes, we want to tack the JWT onto the end of the redirect URL
    // for cases when cookie-based authentication won't work (e.g., Cordova
    // apps like Rocket.Chat)
    let redirectTo = decodeURIComponent(redirect || defaultSuccessRedirect)
    if (responseType === 'token') {
      const urlParts = url.parse(redirectTo)
      urlParts.query = urlParts.query || {}
      urlParts.query.lgJWT = req.lgJWT
      redirectTo = url.format(urlParts)
    }
    if (inviteCode) {
      // if we have an invite code, we're still in the sign-up process and the
      // user may still need to complete their profile, so we redirect to the
      // sign-up route which will detect incomplete profiles
      redirectTo = `/sign-up/${inviteCode}?redirect=${encodeURIComponent(redirectTo)}`
    }
    res.redirect(redirectTo)
  }
}

export function configureAuthWithGitHub(app) {
  // for sign-in
  passport.use('github', new GitHubStrategy({
    clientID: config.server.github.clientID,
    clientSecret: config.server.github.clientSecret,
    callbackURL: config.server.github.callbackURL,
    passReqToCallback: true,
  }, verifyUserFromGitHub))

  // for sign-up
  passport.use('github-sign-up', new GitHubStrategy({
    clientID: config.server.github.clientID,
    clientSecret: config.server.github.clientSecret,
    callbackURL: config.server.github.callbackURL,
    passReqToCallback: true,
  }, createOrUpdateUserFromGitHub))

  app.get('/auth/github', authWithGitHub('github'))
  app.get('/auth/github/sign-up', authWithGitHub('github-sign-up'))
  app.get('/auth/github/callback', passportAuthCallback, authSuccess)
}
