import {GraphQLObjectType} from 'graphql'
import {instrumentResolvers} from './util'

import queries from './queries'
import mutations from './mutations'

const rootFields = Object.assign({}, queries, mutations)

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: instrumentResolvers(rootFields, 'query'),
})
