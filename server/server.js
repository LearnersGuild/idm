/* eslint-disable no-console, no-undef */
/* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */

process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'
import enforceSecure from 'express-sslify'
import cookieParser from 'cookie-parser'
import raven from 'raven'

import configureAuth0 from '@learnersguild/passport-auth0-jwt-cookie'

import configureDevEnvironment from './configureDevEnvironment'
import configureGraphQL from './configureGraphQL'
import handleRender from './render'

export async function start() {
  // error handling
  raven.patchGlobal(process.env.SENTRY_SERVER_DSN)

  const serverPort = parseInt(process.env.PORT, 10)
  const baseUrl = process.env.APP_BASEURL || `http://localhost:${serverPort}`

  const app = new Express()

  if (process.env.NODE_ENV === 'development') {
    configureDevEnvironment(app)
  }

  // Parse cookies.
  app.use(cookieParser())

  // Ensure secure connection in production.
  if (process.env.NODE_ENV === 'production') {
    app.use(enforceSecure.HTTPS({trustProtoHeader: true}))
  }

  // Use this middleware to server up static files
  app.use(serveStatic(path.join(__dirname, '../dist')))
  app.use(serveStatic(path.join(__dirname, '../public')))

  // Configure authentication via Auth0.
  configureAuth0(app, {
    domain: 'learnersguild.auth0.com',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    authURL: '/auth/google',
    callbackURL: '/auth/callback',
    jwtIgnorePaths: [
      '/',              // home page
      /\/auth\/.+/,     // auth routes
      /\/sign-(in|up)/, // auth routes
    ],
  })

  // GraphQL middleware
  await configureGraphQL(app)

  // Default React application
  app.use(handleRender)

  return app.listen(serverPort, error => {
    if (error) {
      console.error(error)
    } else {
      console.info('🌍  Listening at %s', baseUrl)
    }
  })
}
