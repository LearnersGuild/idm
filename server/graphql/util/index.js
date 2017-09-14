import {GraphQLError} from 'graphql/error'

import config from 'src/config'
import {extractUserAvatarUrl, extractUserProfileUrl} from 'src/server/util'

export const errors = {
  notAuthorized: () => (new GraphQLError('You are not authorized to do that.')),
  notFound: type => (new GraphQLError(`${type || 'Item'} not found`)),
}

export function instrumentResolvers(fields, prefix) {
  if (!config.server.newrelic.enabled) {
    return fields
  }
  const newrelic = require('newrelic')

  return Object.keys(fields).map(queryName => {
    const schema = fields[queryName]
    const originalResolver = schema.resolve
    return {
      [queryName]: {
        ...schema,
        resolve: (...args) => {
          newrelic.setTransactionName(`graphql ${prefix} ${queryName}`)
          return originalResolver(...args)
        }
      }
    }
  }).reduce((result, next) => ({...result, ...next}), {})
}

// FIXME: this is janky.
export function applyUserProfileUrls(user) {
  return user ? {
    ...user,
    profileUrl: extractUserProfileUrl(user),
    avatarUrl: extractUserAvatarUrl(user),
  } : user
}
