import jwt from 'jsonwebtoken'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

import r from '../db/connect'
import {encrypt, decrypt} from './symmetricCryptoAES'

const defaultSuccessRedirect = '/'
const failureRedirect = '/'

async function createOrUpdateUser(accessToken, refreshToken, profile, cb) {
  const userInfo = {
    name: profile.displayName,
    email: profile.emails[0].value,
    authProviders: {
      googleOAuth2: profile.id.toString()
    },
  }

  let user = (await r.table('users')
    .getAll(userInfo.authProviders.googleOAuth2, {index: 'googleOAuth2Id'})
    .limit(1)
    .run())[0]
  const result = user ? (
    await r.table('users').update(Object.assign({}, user, userInfo), {returnChanges: true}).run()
  ) : (
    await r.table('users').insert(userInfo, {returnChanges: true}).run()
  )
  user = (result.inserted || result.replaced) ? result.changes[0].new_val : user
  cb(null, user)
}

function getUserById(id) {
  return r.table('users').get(id).pluck('id', 'email', 'name').run()
}

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
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  }, createOrUpdateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => done(null, await getUserById(id)))

  // app configuration
  app.use(passport.initialize())
  app.use(addUserToRequestFromJWTCookie)
  app.use(addUserToRequestFromJWT)

  app.get('/auth/google', (req, res) => {
    // if the app passed-in a place to which we should redirect after the
    // authentication, we'll use it as part of the OAuth2 'state' parameter
    const {redirectTo} = req.query
    const appState = redirectTo ? JSON.stringify({redirectTo}) : JSON.stringify({})
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      state: encrypt(appState),
    })(req, res)
  })

  app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect}),
    (req, res) => {
      const {state} = req.query
      const appState = JSON.parse(decrypt(state))
      const redirectTo = appState.redirectTo || defaultSuccessRedirect
      const token = jwt.sign({iss: 'idm.learnersguild.org', sub: req.user.id}, process.env.SHARED_JWT_SECRET)
      const secure = (process.env.NODE_ENV === 'production')
      const domain = (process.env.NODE_ENV === 'production') ? '.learnersguild.org' : req.hostname
      res.cookie('jwt', token, {domain, secure, httpOnly: true})
      res.redirect(redirectTo)
    }
  )
}
