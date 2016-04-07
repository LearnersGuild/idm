import graphqlHTTP from 'express-graphql'
import cors from 'cors'

import rootSchema from './graphql/rootSchema'

export default function configureGraphQL(app) {
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
}
