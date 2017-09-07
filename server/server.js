/* eslint-disable no-console, no-undef, no-unused-vars */
import path from 'path'
import http from 'http'
import Express from 'express'
import serveStatic from 'serve-static'
import {HTTPS as https} from 'express-sslify'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import raven from 'raven'
import compression from 'compression'

import config from 'src/config'

import configureApp from './configureApp'

import {formatServerError} from './util'

const sentry = new raven.Client(config.server.sentryDSN)

export function start() {
  try {
    // error handling
    raven.patchGlobal(config.server.sentryDSN)

    const app = new Express()
    const httpServer = http.createServer(app)

    app.use(compression())

    configureApp(app)

    // Allow large files to be POSTed to GraphQL endpoints.
    app.use(bodyParser.json({limit: '10mb'}))

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

    // avatar routes
    app.use('/avatars', (req, res, next) => {
      require('./avatars')(req, res, next)
    })

    // Default React application
    app.get('*', (req, res, next) => {
      require('./render').default(req, res, next)
    })

    // catch-all error handler
    app.use((err, req, res, next) => {
      const serverError = formatServerError(err)
      const responseBody = `<h1>${serverError.statusCode} - ${serverError.type}</h1><p>${serverError.message}</p>`

      if (serverError.statusCode >= 400) {
        sentry.captureException(err)

        console.error(`${serverError.name || 'UNHANDLED ERROR'}:
          method: ${req.method.toUpperCase()} ${req.originalUrl}
          params: ${JSON.stringify(req.params)}
          ${config.server.secure ? serverError.toString() : serverError.stack}`)
      }

      res.status(serverError.statusCode).send(responseBody)
    })

    return httpServer.listen(config.server.port, err => {
      if (err) {
        console.error(err)
      } else {
        console.info('🌍  Listening at %s', config.app.baseURL)
      }
    })
  } catch (err) {
    console.error(err.stack)
    sentry.captureException(err)
  }
}
