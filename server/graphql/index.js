import raven from 'raven'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'

const config = require('../../config')

import {formatServerError} from '../util'
import rootSchema from './rootSchema'

const sentry = new raven.Client(config.server.sentryDSN)

const app = new express.Router()

const corsOptions = {
  origin: [
    /\.learnersguild.org/,
    /\.learnersguild.dev/,
  ],
  exposedHeaders: ['LearnersGuild-JWT'],
}

app.use('/graphql', cors(corsOptions), graphqlHTTP(req => ({
  schema: rootSchema,
  rootValue: {currentUser: req.user},
  pretty: true,
  formatError: error => {
    const serverError = formatServerError(error)

    if (serverError.statusCode >= 400) {
      sentry.captureException(serverError)

      console.error(`${serverError.name || 'UNHANDLED GRAPHQL ERROR'}:
        ${config.server.secure ? serverError.toString() : serverError.stack}`)
    }

    return serverError
  },
})))

export default app
