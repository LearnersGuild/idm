import jwt from 'jsonwebtoken'
import passport from 'passport'

import {getUserById, clearJWTCookie} from './helpers'
import {configureAuthWithGitHub} from './github'

const authHeaderRegex = /^Bearer\s([A-Za-z0-9+\/_\-\.]+)$/

async function addUserToRequestFromJWTCookie(req, res, next) {
  try {
    if (!req.cookies || !req.cookies.jwt) {
      return next()
    }
    const idToken = req.cookies.jwt
    const jwtObject = jwt.verify(idToken, process.env.SHARED_JWT_SECRET)
    const user = await getUserById(jwtObject.sub)
    if (user) {
      req.user = Object.assign({idToken}, user)
    } else {
      clearJWTCookie(req, res)
    }
  } catch (err) {
    console.info('Invalid or non-existent JWT cookie')
  }
  next()
}

async function addUserToRequestFromJWT(req, res, next) {
  try {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
      return next()
    }
    const idToken = authHeader.match(authHeaderRegex)[1]
    const jwtObject = jwt.verify(idToken, process.env.SHARED_JWT_SECRET)
    const user = await getUserById(jwtObject.sub)
    if (user) {
      req.user = Object.assign({idToken}, user)
    } else {
      clearJWTCookie(req, res)
    }
  } catch (err) {
    console.info("Invalid JWT or non-existent 'Authorization: Bearer' header")
  }
  next()
}

export function verifyJWT(req, res, next) {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return res.status(401).json({code: 401, type: 'Unauthorized', message: 'No Authorization header found.'})
  }
  try {
    const idToken = authHeader.match(authHeaderRegex)[1]
    const jwtObject = jwt.verify(idToken, process.env.SHARED_JWT_SECRET)
    if (jwtObject.iss !== 'idm.learnersguild.org') {
      return res.status(401).json({code: 401, type: 'Unauthorized', message: 'Invalid JWT issuer.'})
    }
  } catch (err) {
    return res.status(401).json({code: 401, type: 'Unauthorized', message: 'Invalid JWT signature.'})
  }
  next()
}

export default function configureAuth(app) {
  // set up passport
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
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
