import passport from 'passport'

import {getUserById, slideJWTSession, cookieOptsJWT} from './helpers'
import {configureAuthWithGitHub} from './github'

export default function configureAuth(app) {
  // set up passport
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('deserializeUser')
      done(null, await getUserById(id))
    } catch (err) {
      console.error(err.stack)
    }
  })

  // app configuration
  app.use(passport.initialize())
  app.use(slideJWTSession)

  // sign-out
  app.get('/auth/sign-out', (req, res) => {
    res.clearCookie('lgJWT', cookieOptsJWT(req))
    res.redirect('/')
  })

  // provider configuration
  configureAuthWithGitHub(app)
}
