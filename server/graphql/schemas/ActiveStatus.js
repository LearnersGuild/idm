import {GraphQLNonNull, GraphQLID, GraphQLBoolean} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'ActiveStatus',
  description: 'A user id and whether or not the user is active',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    active: {type: new GraphQLNonNull(GraphQLBoolean), description: 'True if the user is active'},
  }),
})
