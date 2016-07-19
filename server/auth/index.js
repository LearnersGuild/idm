import express from 'express'
import passport from 'passport'
import raven from 'raven'

import {cookieOptsJWT} from '@learnersguild/idm-jwt-auth/lib/utils'
import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'

import {configureAuthWithGitHub} from './github'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const app = new express.Router()

// set up passport -- we're not using sessions, so these are likely unused
// but passport still requires we implement them
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// app configuration
app.use(passport.initialize())
app.use(addUserToRequestFromJWT)
app.use((req, res, next) => {
  refreshUserFromIDMService(req, res, err => {
    if (err) {
      // this is not enough to break things -- if we are unable to refresh the
      // user from IDM, but our JWT is still valid, it's okay, so we won't
      // allow this error to propagate beyond this point
      console.warn('WARNING: unable to refresh user from IDM service:', err)
      sentry.captureException(err)
    }
    next()
  })
})
app.use(extendJWTExpiration)

// sign-out
app.get('/auth/sign-out', (req, res) => {
  res.clearCookie('lgJWT', cookieOptsJWT(req))
  res.redirect('/')
})

// provider configuration
configureAuthWithGitHub(app)

export default app
