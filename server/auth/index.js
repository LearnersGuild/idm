import jwt from 'jsonwebtoken'
import passport from 'passport'

import {getUserById, clearJWTCookie, userFromJWTClaims, jwtIssuer} from './helpers'
import {configureAuthWithGitHub} from './github'

const authHeaderRegex = /^Bearer\s([A-Za-z0-9+\/_\-\.]+)$/

function userFromJWT(lgJWT) {
  const jwtClaims = jwt.verify(lgJWT, process.env.SHARED_JWT_SECRET, {issuer: jwtIssuer})
  return Object.assign({lgJWT}, userFromJWTClaims(jwtClaims))
}

function addUserToRequestFromJWTCookie(req, res, next) {
  try {
    if (!req.cookies || !req.cookies.lgJWT) {
      return next()
    }
    req.user = userFromJWT(req.cookies.lgJWT)
  } catch (err) {
    console.info('Invalid or non-existent JWT cookie')
    clearJWTCookie(req, res)
  }
  next()
}

function addUserToRequestFromJWT(req, res, next) {
  try {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
      return next()
    }
    req.user = userFromJWT(authHeader.match(authHeaderRegex)[1])
  } catch (err) {
    console.info("Invalid JWT or non-existent 'Authorization: Bearer' header")
    clearJWTCookie(req, res)
  }
  next()
}

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
  app.use(addUserToRequestFromJWTCookie)
  app.use(addUserToRequestFromJWT)

  // sign-out
  app.get('/auth/sign-out', (req, res) => {
    clearJWTCookie(req, res)
    res.redirect('/')
  })

  // provider configuration
  configureAuthWithGitHub(app)
}
