import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

import r from '../../db/connect'
import {encrypt, decrypt} from '../symmetricCryptoAES'

import {createOrUpdateUser, setJWTCookie, defaultSuccessRedirect, failureRedirect} from './helpers'

async function createOrUpdateUserFromGoogle(accessToken, refreshToken, profile, cb) {
  const userInfo = {
    name: profile.displayName,
    email: profile.emails[0].value,
    authProviders: {
      googleOAuth2: {accessToken, refreshToken, profile},
    },
  }

  let user = (await r.table('users')
    .getAll(userInfo.authProviders.googleOAuth2.profile.id, {index: 'googleOAuth2Id'})
    .limit(1)
    .run())[0]
  const result = await createOrUpdateUser(user, userInfo)
  user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
  cb(null, user)
}

export function configureAuthWithGoogle(app) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
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
