import graphqlHTTP from 'express-graphql'

import rootSchema from './graphql/rootSchema'

export default function configureGraphQL(app) {
  app.use('/graphql', graphqlHTTP(req => ({
    schema: rootSchema,
    rootValue: {currentUser: req.user},
    pretty: true,
  })))
}
