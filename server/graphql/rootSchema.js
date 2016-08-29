import {GraphQLSchema} from 'graphql'

import query from './rootQuery'
import mutation from './rootMutation'

export default new GraphQLSchema({query, mutation})
