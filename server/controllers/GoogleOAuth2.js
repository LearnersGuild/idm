import passport from 'passport'

import {
  findByEmailAndUpdateOrCreate as findByEmailAndUpdateOrCreateUser
} from '../dao/Users'


export function updateUser(accessToken, refreshToken, profile, done) {
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

export function authenticate(req, res, next) {
  const scopes = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
  ]

  passport.authenticate('google', { scope: scopes, accessType: 'offline'})(req, res, next)
}

export function callback(req, res, next) {
  passport.authenticate(
    'google',
    { failureRedirect: '/' },
    (user) => {
      res.status(200).json(user)
    }
  )(req, res, next)
}
