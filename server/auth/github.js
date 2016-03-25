import raven from 'raven'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import {Strategy as GitHubStrategy} from 'passport-github'

import {encrypt, decrypt} from '../symmetricCryptoAES'

import {
  createOrUpdateUser,
  getUsersForEmails,
  addRolesDeducibleFromEmails,
  defaultSuccessRedirect,
  slideJWTSession,
} from './helpers'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export function githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails, inviteCode) {
  return addRolesDeducibleFromEmails({
    name: profile.displayName,
    email: primaryEmail,
    handle: profile.username,
    emails,
    inviteCode,
    authProviders: {
      githubOAuth2: {accessToken, refreshToken},
    },
    authProviderProfiles: {
      githubOAuth2: profile,
    },
  })
}

function getGitHubEmails(accessToken) {
  return fetch(`https://api.github.com/user/emails?access_token=${accessToken}`).then(resp => resp.json())
}

async function verifyUserFromGitHub(req, accessToken, refreshToken, profile, cb) {
  try {
    const ghEmails = await getGitHubEmails(accessToken)
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    let user = (await getUsersForEmails(emails))[0]
    if (!user) {
      return cb(null, false)
    }
    const userInfo = githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails)
    const result = await createOrUpdateUser(user, userInfo)
    user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
    cb(null, user)
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
    cb(err)
  }
}

async function createOrUpdateUserFromGitHub(req, accessToken, refreshToken, profile, cb) {
  try {
    const {inviteCode} = JSON.parse(decrypt(req.query.state))
    const ghEmails = await getGitHubEmails(accessToken)
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    let user = (await getUsersForEmails(emails))[0]
    const userInfo = githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails, inviteCode)
    const result = await createOrUpdateUser(user, userInfo)
    user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
    cb(null, user)
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
    cb(err)
  }
}

function authWithGitHub(strategyName) {
  return (req, res) => {
    // rather than using something heavyweight like express sessions, we'll just
    // use OAuth2 state to store relevant context information since the payload
    // is small
    const appState = Object.assign({strategyName}, req.query)
    passport.authenticate(strategyName, {
      scope: ['user', 'repo'],
      approvalPrompt: 'auto',
      state: encrypt(JSON.stringify(appState)),
    })(req, res)
  }
}

export function configureAuthWithGitHub(app) {
  // for sign-in
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASEURL}/auth/github/callback`,
    passReqToCallback: true,
  }, verifyUserFromGitHub))

  // for sign-up
  passport.use('github-sign-up', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASEURL}/auth/github/callback`,
    passReqToCallback: true,
  }, createOrUpdateUserFromGitHub))

  app.get('/auth/github', authWithGitHub('github'))
  app.get('/auth/github/sign-up', authWithGitHub('github-sign-up'))
  app.get('/auth/github/callback',
    (req, res, next) => {
      const appState = JSON.parse(decrypt(req.query.state))
      // sign-up and sign-in have different strategy names, but use the same OAuth2 app
      const failureRedirect = `/sign-in?redirect=${encodeURIComponent(appState.redirect)}&err=auth`
      return passport.authenticate(appState.strategyName, {failureRedirect})(req, res, next)
    },
    (req, res) => {
      const appState = JSON.parse(decrypt(req.query.state))
      const redirect = appState.redirect || defaultSuccessRedirect
      slideJWTSession(req, res)
      res.redirect(redirect)
    }
  )
}
