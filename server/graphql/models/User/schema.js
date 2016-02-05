import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'
import {GraphQLEmailType} from '../types'

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmailType), description: 'The user email'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    createdAt: {type: GraphQLString, description: 'The (ISO 8601) datetime the user was created'},
    updatedAt: {type: GraphQLString, description: 'The (ISO 8601) datetime the user was last updated'},
  })
})
