import graphqlHTTP from 'express-graphql'

import {verifyJWT} from './auth'
import rootSchema from './graphql/rootSchema'

export default function configureGraphQL(app) {
  return new Promise(resolve => {
    app.use('/graphql', verifyJWT, graphqlHTTP({schema: rootSchema, pretty: true}))
    return resolve()
  })
}
