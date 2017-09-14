import {GraphQLNonNull, GraphQLString, GraphQLBoolean} from 'graphql'
import {GraphQLInputObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'InputInviteCode',
  description: 'The invite code',
  fields: () => ({
    code: {type: new GraphQLNonNull(GraphQLString), description: 'The invite code'},
    description: {type: new GraphQLNonNull(GraphQLString), description: 'The description of for whom the code was created'},
    roles: {type: new GraphQLList(GraphQLString), description: 'The roles to assign to users who sign-up with this invite code'},
    active: {type: GraphQLBoolean, description: 'Whether or not this invite code is active'},
    permanent: {type: GraphQLBoolean, description: 'Whether or not this invite code should automatically expire'},
  })
})
