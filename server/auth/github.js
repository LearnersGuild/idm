import raven from 'raven'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import {Strategy as GitHubStrategy} from 'passport-github'

import {encrypt, decrypt} from '../symmetricCryptoAES'

import {
  createOrUpdateUser,
  setJWTCookie,
  getUsersForEmails,
  addRolesDeducibleFromEmails,
  defaultSuccessRedirect,
  failureRedirect
} from './helpers'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export function githubProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails) {
  return addRolesDeducibleFromEmails({
    name: profile.displayName,
    email: primaryEmail,
    handle: profile.username,
    emails,
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

async function verifyUserFromGitHub(accessToken, refreshToken, profile, cb) {
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

async function createOrUpdateUserFromGitHub(accessToken, refreshToken, profile, cb) {
  try {
    const ghEmails = await getGitHubEmails(accessToken)
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    let user = (await getUsersForEmails(emails))[0]
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

function authWithGitHub(strategyName) {
  return (req, res) => {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    const {redirectTo} = req.query
    const appState = redirectTo ? JSON.stringify({strategyName, redirectTo}) : JSON.stringify({strategyName})
    passport.authenticate(strategyName, {
      scope: ['user', 'repo'],
      approvalPrompt: 'auto',
      state: encrypt(appState),
    })(req, res)
  }
}

export function configureAuthWithGitHub(app) {
  // for sign-in
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASEURL}/auth/github/callback`,
  }, verifyUserFromGitHub))

  // for sign-up
  passport.use('github-sign-up', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASEURL}/auth/github/callback`,
  }, createOrUpdateUserFromGitHub))

  app.get('/auth/github', authWithGitHub('github'))
  app.get('/auth/github/sign-up', authWithGitHub('github-sign-up'))
  app.get('/auth/github/callback',
    (req, res, next) => {
      const {state} = req.query
      const appState = JSON.parse(decrypt(state))
      // sign-up and sign-in have different strategy names, but use the same OAuth2 app
      return passport.authenticate(appState.strategyName, {failureRedirect})(req, res, next)
    },
    (req, res) => {
      const {state} = req.query
      const appState = JSON.parse(decrypt(state))
      const redirectTo = appState.redirectTo || defaultSuccessRedirect
      setJWTCookie(req, res)
      res.redirect(redirectTo)
    }
  )
}
