/* eslint-disable no-console, no-undef, no-unused-vars */
/* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */

process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'
import enforceSecure from 'express-sslify'
import cookieParser from 'cookie-parser'
import raven from 'raven'

import configureDevEnvironment from './configureDevEnvironment'
import configureAuth from './auth'
import configureGraphQL from './configureGraphQL'
import handleRender from './render'

export async function start() {
  try {
    // error handling
    raven.patchGlobal(process.env.SENTRY_SERVER_DSN)

    const serverPort = parseInt(process.env.PORT, 10)
    const baseUrl = process.env.APP_BASEURL || `http://localhost:${serverPort}`

    const app = new Express()

    // catch-all error handler
    app.use((err, req, res, next) => {
      const errInfo = (process.env.NODE_ENV === 'production') ? '500 Internal Server Error' : err.stack
      console.error(errInfo)
      res.status(500).send(errInfo)
    })

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
    configureAuth(app)

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
  } catch (err) {
    console.error(err.stack)
  }
}
