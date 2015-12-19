/* eslint-disable no-console */ // TODO: remove this

import passport from 'passport'
import { OAuth2Strategy as GoogleOAuth2Strategy } from 'passport-google-oauth'

import {
  findByEmailAndUpdateOrCreate as findByEmailAndUpdateOrCreateUser
} from './dao/Users'


function updateUser(accessToken, refreshToken, profile, done) {
  const userData = {
    name: profile.displayName,
    email: profile.emails[0].value,
    _google_auth_info: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile,
    },
  }
  findByEmailAndUpdateOrCreateUser(userData.email, userData)
    .then((user) => done(user))
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
    }, updateUser)
  )

  app.get('/auth/google', handleAuthenticate)
  app.get('/auth/google/callback', handleCallback)
}
