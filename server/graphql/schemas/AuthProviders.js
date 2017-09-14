import {GraphQLNonNull} from 'graphql'
import {GraphQLObjectType} from 'graphql/type'

import AuthProvider from './AuthProvider'

export default new GraphQLObjectType({
  name: 'AuthProviders',
  description: 'The auth providers',
  fields: () => ({
    githubOAuth2: {type: new GraphQLNonNull(AuthProvider), description: 'The GitHub token(s)'},
    googleOAuth2: {type: new GraphQLNonNull(AuthProvider), description: 'The Google token(s)'},
  })
})
