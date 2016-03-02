import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'
import {GraphQLEmailType, GraphQLDateType, GraphQLURLType} from '../types'

export const socialURLAttrs = {
  github: { type: GraphQLURLType },
  linkedin: { type: GraphQLURLType },
  facebook: { type: GraphQLURLType },
  twitter: { type: GraphQLURLType },
}

const SocialURLsType = new GraphQLObjectType({
  name: 'SocialURLs',
  fields: () => socialURLAttrs,
})

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmailType), description: 'The user email'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    dateOfBirth: {type: new GraphQLNonNull(GraphQLDateType), description: "The user's date of birth"},
    socialURLs: {type: SocialURLsType, description: 'Social URLs for the user'},
    createdAt: {type: GraphQLDateType, description: 'The datetime the user was created'},
    updatedAt: {type: GraphQLDateType, description: 'The datetime the user was last updated'},
  })
})
