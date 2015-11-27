/* eslint-disable no-console, no-undef */
process.env.PORT = process.env.PORT || '8080'

import path from 'path'
import Express from 'express'
import serveStatic from 'serve-static'

import configureDevEnvironment from './configure-dev-environment'
import configureSwagger from './configure-swagger'
import handleRender from './render'

const serverHost = process.env.APP_HOSTNAME || 'localhost'
const serverPort = parseInt(process.env.PORT, 10)

const app = new Express()

if (__DEVELOPMENT__) {
  configureDevEnvironment(app)
}

// Use this middleware to server up static files
app.use(serveStatic(path.join(__dirname, '../dist')))
app.use(serveStatic(path.join(__dirname, '../public')))

// Swagger middleware
configureSwagger(app, ()=> {
  app.listen(serverPort, (error) => {
    if (error) {
      console.error(error)
    } else {
      console.info('🌍  Listening at http://%s:%d ', serverHost, serverPort)
    }
  })
})

// Default React application
app.use(handleRender)
