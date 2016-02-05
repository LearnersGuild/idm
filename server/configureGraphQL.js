import graphql from 'graphql'
import graphqlHTTP from 'express-graphql'

import rootSchema from './graphql/rootSchema'

export default function configureGraphQL(app) {
  return new Promise(resolve => {
    app.use('/graphql', graphqlHTTP({schema: rootSchema, pretty: true, graphiql: true}))
    return resolve()
  })
}
