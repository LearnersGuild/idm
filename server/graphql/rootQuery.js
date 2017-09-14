import {GraphQLObjectType} from 'graphql'
import {instrumentResolvers} from './util'

import queryFields from './queries'

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: instrumentResolvers(queryFields, 'query'),
})
