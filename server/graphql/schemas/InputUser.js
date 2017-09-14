import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types'

import {GraphQLPhoneNumber} from 'src/server/graphql/types'

export default new GraphQLInputObjectType({
  name: 'InputUser',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmail), description: 'The user email'},
    handle: {type: new GraphQLNonNull(GraphQLString), description: 'The user handle'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    phone: {type: GraphQLPhoneNumber, description: 'The user phone number'},
    dateOfBirth: {type: GraphQLDateTime, description: "The user's date of birth"},
    timezone: {type: GraphQLString, description: 'The user timezone'},
  })
})
