import raven from 'raven'
import fetch from 'isomorphic-fetch'
import passport from 'passport'
import {Strategy as GitHubStrategy} from 'passport-github'

import r from '../../db/connect'
import {encrypt, decrypt} from '../symmetricCryptoAES'

import {createOrUpdateUser, setJWTCookie, defaultSuccessRedirect, failureRedirect} from './helpers'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

async function createOrUpdateUserFromGitHub(accessToken, refreshToken, profile, cb) {
  try {
    const ghEmails = await fetch(`https://api.github.com/user/emails?access_token=${accessToken}`).then(resp => resp.json())
    const primaryEmail = ghEmails.filter(email => email.primary)[0].email
    const emails = ghEmails.map(email => email.email)
    const userInfo = {
      name: profile.displayName,
      email: primaryEmail,
      emails: emails,
      authProviders: {
        githubOAuth2: {accessToken, refreshToken, profile},
      },
    }

    let user = (await r.table('users')
      .getAll(userInfo.authProviders.githubOAuth2.profile.id, {index: 'githubOAuth2Id'})
      .limit(1)
      .run())[0]
    const result = await createOrUpdateUser(user, userInfo)
    user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
    cb(null, user)
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
  }
}

export function configureAuthWithGitHub(app) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
  }, createOrUpdateUserFromGitHub))

  app.get('/auth/github', (req, res) => {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    const {redirectTo} = req.query
    const appState = redirectTo ? JSON.stringify({redirectTo}) : JSON.stringify({})
    passport.authenticate('github', {
      scope: ['user', 'repo'],
      accessType: 'offline',
      approvalPrompt: 'auto',
      state: encrypt(appState),
    })(req, res)
  })

  app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect}),
    (req, res) => {
      const {state} = req.query
      const appState = JSON.parse(decrypt(state))
      const redirectTo = appState.redirectTo || defaultSuccessRedirect
      setJWTCookie(req, res)
      res.redirect(redirectTo)
    }
  )
}
