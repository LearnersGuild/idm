/* eslint-disable no-console, no-undef, no-unused-vars */
import path from 'path'
import http from 'http'
import Express from 'express'
import serveStatic from 'serve-static'
import {HTTPS as https} from 'express-sslify'
import cookieParser from 'cookie-parser'
import raven from 'raven'

const config = require('../config')

import configureApp from './configureApp'
import configureChangeFeeds from './configureChangeFeeds'

const sentry = new raven.Client(config.server.sentryDSN)

export function start() {
  try {
    // error handling
    raven.patchGlobal(config.server.sentryDSN)

    const app = new Express()
    const httpServer = http.createServer(app)

    // catch-all error handler
    app.use((err, req, res, next) => {
      const errCode = err.code || 500
      const errType = err.type || 'Internal Server Error'
      const errMessage = err.message || config.server.secure ? err.toString() : err.stack
      const errInfo = `<h1>${errCode} - ${errType}</h1><p>${errMessage}</p>`
      console.error(err.stack)
      res.status(500).send(errInfo)
    })

    configureApp(app)

    // Parse cookies.
    app.use(cookieParser())

    // Ensure secure connection in production.
    if (config.server.secure) {
      /* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */
      app.use(https({trustProtoHeader: true}))
    }

    // Use this middleware to server up static files
    app.use(serveStatic(path.join(__dirname, '../dist')))
    app.use(serveStatic(path.join(__dirname, '../public')))

    // auth routes
    app.use((req, res, next) => {
      require('./auth')(req, res, next)
    })

    // GraphQL routes
    app.use((req, res, next) => {
      require('./graphql')(req, res, next)
    })

    // Default React application
    app.get('*', (req, res, next) => {
      require('./render').default(req, res, next)
    })

    // change feeds
    configureChangeFeeds()

    return httpServer.listen(config.server.port, error => {
      if (error) {
        console.error(error)
      } else {
        console.info('🌍  Listening at %s', config.app.baseURL)
      }
    })
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
  }
}
