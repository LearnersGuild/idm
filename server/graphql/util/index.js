import {GraphQLError} from 'graphql/error'

export const errors = {
  notAuthorized: () => (new GraphQLError('You are not authorized to do that.')),
  notFound: type => (new GraphQLError(`${type || 'Item'} not found`)),
}
