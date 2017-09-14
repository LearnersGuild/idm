import {GraphQLString, GraphQLNonNull} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'AuthProvider',
  description: 'An auth provider',
  fields: () => ({
    accessToken: {type: new GraphQLNonNull(GraphQLString), description: 'The access token'},
    refreshToken: {type: GraphQLString, description: 'The refresh token'},
  })
})
