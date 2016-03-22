import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export const InviteCode = new GraphQLObjectType({
  name: 'InviteCode',
  description: 'An invitation code to allow a user to sign-up',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The invite code UUID'},
    code: {type: new GraphQLNonNull(GraphQLString), description: 'The invite code'},
    description: {type: new GraphQLNonNull(GraphQLString), description: 'The description of for whom the code was created'},
  })
})
