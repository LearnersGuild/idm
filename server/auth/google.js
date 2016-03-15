import raven from 'raven'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

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

export function googleProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails) {
  return addRolesDeducibleFromEmails({
    name: profile.displayName,
    email: primaryEmail,
    emails,
    authProviders: {
      googleOAuth2: {accessToken, refreshToken, profile},
    },
  })
}

async function createOrUpdateUserFromGoogle(accessToken, refreshToken, profile, cb) {
  try {
    const primaryEmail = profile.emails.filter(email => (email.type === 'account'))[0].value
    const emails = profile.emails.map(email => email.value)
    const userInfo = googleProfileToUserInfo(accessToken, refreshToken, profile, primaryEmail, emails)
    let user = (await getUsersForEmails(emails))[0]
    if (user) {
      // don't overwrite refreshToken
      // See: https://developers.google.com/identity/protocols/OAuth2WebServer#handlingresponse
      userInfo.authProviders.googleOAuth2.refreshToken = user.authProviders.googleOAuth2.refreshToken
    }
    const result = await createOrUpdateUser(user, userInfo)
    user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
    cb(null, user)
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
  }
}

export function configureAuthWithGoogle(app) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.APP_BASEURL}/auth/google/callback`,
  }, createOrUpdateUserFromGoogle))

  app.get('/auth/google', (req, res) => {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    const {redirectTo} = req.query
    const appState = redirectTo ? JSON.stringify({redirectTo}) : JSON.stringify({})
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      accessType: 'offline',
      approvalPrompt: 'auto',
      state: encrypt(appState),
    })(req, res)
  })

  app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect}),
    (req, res) => {
      const {state} = req.query
      const appState = JSON.parse(decrypt(state))
      const redirectTo = appState.redirectTo || defaultSuccessRedirect
      setJWTCookie(req, res)
      res.redirect(redirectTo)
    }
  )
}
