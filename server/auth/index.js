import jwt from 'jsonwebtoken'
import passport from 'passport'

import {getUserById} from './helpers'
import {configureAuthWithGoogle} from './google'

async function addUserToRequestFromJWTCookie(req, res, next) {
  if (!req.cookies || !req.cookies.jwt) {
    return next()
  }
  try {
    const idToken = req.cookies.jwt
    const jwtObject = jwt.verify(idToken, process.env.SHARED_JWT_SECRET)
    req.user = Object.assign({idToken}, await getUserById(jwtObject.sub))
  } catch (err) {
    console.info('Invalid or non-existent JWT cookie')
  }
  next()
}

async function addUserToRequestFromJWT(req, res, next) {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return next()
  }
  try {
    const idToken = authHeader.match(/^Bearer\s([A-Za-z0-9+\/_\-\.]+)$/)[1]
    const jwtObject = jwt.verify(idToken, process.env.SHARED_JWT_SECRET)
    req.user = Object.assign({idToken}, await getUserById(jwtObject.sub))
  } catch (err) {
    console.info("Invalid JWT or non-existent 'Authorization: Bearer' header")
  }
  next()
}

export default function configureAuth(app) {
  // set up passport
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => done(null, await getUserById(id)))

  // app configuration
  app.use(passport.initialize())
  app.use(addUserToRequestFromJWTCookie)
  app.use(addUserToRequestFromJWT)

  // provider configuration
  configureAuthWithGoogle(app)
}
