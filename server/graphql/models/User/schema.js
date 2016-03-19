import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLObjectType, GraphQLList} from 'graphql/type'
import {GraphQLEmailType, GraphQLDateType, GraphQLPhoneNumberType} from '../types'

const AuthProvider = new GraphQLObjectType({
  name: 'AuthProvider',
  description: 'An auth provider',
  fields: () => ({
    accessToken: {type: new GraphQLNonNull(GraphQLString), description: 'The access token'},
    refreshToken: {type: GraphQLString, description: 'The refresh token'},
  })
})

const AuthProviders = new GraphQLObjectType({
  name: 'AuthProviders',
  description: 'The auth providers',
  fields: () => ({
    githubOAuth2: {type: new GraphQLNonNull(AuthProvider), description: 'The GitHub token(s)'},
    googleOAuth2: {type: new GraphQLNonNull(AuthProvider), description: 'The Google token(s)'},
  })
})

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmailType), description: 'The user email'},
    emails: {type: new GraphQLNonNull(new GraphQLList(GraphQLEmailType)), description: 'The user emails'},
    handle: {type: new GraphQLNonNull(GraphQLString), description: 'The user handle'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    phone: {type: GraphQLPhoneNumberType, description: 'The user phone number'},
    dateOfBirth: {type: GraphQLDateType, description: "The user's date of birth"},
    timezone: {type: GraphQLString, description: 'The user phone number'},
    roles: {type: new GraphQLList(GraphQLString), description: 'The user roles'},
    authProviders: {type: AuthProviders, description: 'The user auth providers'},
  })
})
