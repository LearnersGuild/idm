/* eslint-disable no-console */ // TODO: remove this

import passport from 'passport'
import { OAuth2Strategy as GoogleOAuth2Strategy } from 'passport-google-oauth'

function verifyUser(accessToken, refreshToken, profile, done) {
  // TODO: verify the user account in the database
  console.log('accessToken:', accessToken)
  console.log('refreshToken:', refreshToken)
  const user = {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    name: profile.displayName,
    email: profile.emails[0].value,
    avatarUrl: profile.photos[0].value,
  }
  return done(user)
}

function handleAuthenticate(req, res, next) {
  const scopes = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
  ]

  passport.authenticate('google', { scope: scopes, accessType: 'offline'})(req, res, next)
}

function handleCallback(req, res, next) {
  passport.authenticate(
    'google',
    { failureRedirect: '/' },
    (user) => {
      res.status(200).json(user)
    }
  )(req, res, next)
}

export default function configureGoogleAuth(app) {
  passport.use(
    new GoogleOAuth2Strategy({
      clientID: process.env.GOOGLE_API_CLIENT_ID,
      clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
      callbackURL: `${process.env.APP_BASEURL}/auth/google/callback`,
    }, verifyUser)
  )

  app.get('/auth/google', handleAuthenticate)
  app.get('/auth/google/callback', handleCallback)
}
