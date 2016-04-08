import express from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'

import rootSchema from './rootSchema'

/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const app = express.Router()

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
})))

export default app
