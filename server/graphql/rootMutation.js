import {GraphQLObjectType} from 'graphql'
import user from './models/User/mutation'

const rootFields = Object.assign(user)

export default new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => rootFields
})
