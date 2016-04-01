import passport from 'passport'

import {cookieOptsJWT} from '@learnersguild/idm-jwt-auth/lib/utils'
import {
  addUserToRequestFromJWT,
  extendJWTExpiration,
  refreshUserFromIDMService
} from '@learnersguild/idm-jwt-auth/lib/middlewares'

import {configureAuthWithGitHub} from './github'

export default function configureAuth(app) {
  // set up passport -- we're not using sessions, so these are likely unused
  // but passport still requires we implement them
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  // app configuration
  app.use(passport.initialize())
  app.use(addUserToRequestFromJWT)
  app.use(refreshUserFromIDMService)
  app.use(extendJWTExpiration)

  // sign-out
  app.get('/auth/sign-out', (req, res) => {
    res.clearCookie('lgJWT', cookieOptsJWT(req))
    res.redirect('/')
  })

  // provider configuration
  configureAuthWithGitHub(app)
}
