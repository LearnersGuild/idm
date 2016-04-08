/* eslint-disable no-console, no-undef, no-unused-vars */
process.env.PORT = process.env.PORT || '9001'

import http from 'http'
import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'
import enforceSecure from 'express-sslify'
import cookieParser from 'cookie-parser'
import raven from 'raven'

import configureDevEnvironment from './configureDevEnvironment'
import configureSocketCluster from './configureSocketCluster'

export function start() {
  // error handling
  raven.patchGlobal(process.env.SENTRY_SERVER_DSN)

  const serverPort = parseInt(process.env.PORT, 10)
  const baseUrl = process.env.APP_BASEURL

  const app = new Express()
  const httpServer = http.createServer(app)

  // catch-all error handler
  app.use((err, req, res, next) => {
    const errCode = err.code || 500
    const errType = err.type || 'Internal Server Error'
    const errMessage = err.message || (process.env.NODE_ENV === 'production') ? err.toString() : err.stack
    const errInfo = `<h1>${errCode} - ${errType}</h1><p>${errMessage}</p>`
    console.error(err.stack)
    res.status(500).send(errInfo)
  })

  if (process.env.NODE_ENV === 'development') {
    configureDevEnvironment(app)
  }

  // Parse cookies.
  app.use(cookieParser())

  // Ensure secure connection in production.
  if (process.env.NODE_ENV === 'production') {
    /* eslint new-cap: [2, {"capIsNewExceptions": ["HTTPS"]}] */
    app.use(enforceSecure.HTTPS({trustProtoHeader: true}))
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

  // SocketCluster
  configureSocketCluster(httpServer)

  return httpServer.listen(serverPort, error => {
    if (error) {
      console.error(error)
    } else {
      console.info('🌍  Listening at %s', baseUrl)
    }
  })
}
