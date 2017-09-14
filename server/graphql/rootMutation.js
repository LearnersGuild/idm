import {GraphQLObjectType} from 'graphql'
import {instrumentResolvers} from './util'

import mutationFields from './mutations'

export default new GraphQLObjectType({
  name: 'RootMutation',
  fields: instrumentResolvers(mutationFields, 'mutation'),
})
