/* eslint-disable no-console, no-undef */
/* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */

process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'
import enforceSecure from 'express-sslify'
import raven from 'raven'

import configureDevEnvironment from './configureDevEnvironment'
import configureGraphQL from './configureGraphQL'
import handleRender from './render'

export function start() {
  // error handling
  raven.patchGlobal(process.env.SENTRY_SERVER_DSN)

  const serverPort = parseInt(process.env.PORT, 10)
  const baseUrl = process.env.APP_BASEURL || `http://localhost:${serverPort}`

  const app = new Express()

  if (process.env.NODE_ENV === 'development') {
    configureDevEnvironment(app)
  }

  // Ensure secure connection in production.
  if (process.env.NODE_ENV === 'production') {
    app.use(enforceSecure.HTTPS({trustProtoHeader: true}))
  }

  // Use this middleware to server up static files
  app.use(serveStatic(path.join(__dirname, '../dist')))
  app.use(serveStatic(path.join(__dirname, '../public')))

  return Promise.all([
    // GraphQL middleware
    configureGraphQL(app),
  ]).then(() => {
    // Default React application
    app.use(handleRender)

    return app.listen(serverPort, error => {
      if (error) {
        console.error(error)
      } else {
        console.info('🌍  Listening at %s', baseUrl)
      }
    })
  })
}
