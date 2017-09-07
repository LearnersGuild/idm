import {GraphQLError} from 'graphql/error'

import config from 'src/config'

export class LGInternalServerError extends Error {
  constructor(value) {
    if (typeof value === 'string') {
      super(value)
    } else {
      super()
      this.message = 'An internal server error occurred'
      if (value instanceof Error) {
        this.originalError = value
      }
    }
    this.name = 'LGInternalServerError'
    this.type = 'Internal Server Error'
    this.statusCode = 500
  }
}

export function formatServerError(error = new Error()) {
  if (/Reql\w+Error/.test(error.name) || (error.originalError &&
      /Reql\w+Error/.test(error.originalError.name))) {
    // RethinkDb errors masked as internal errors
    return _internalServerError(error)
  } else if (error.name === 'BadRequestError') {
    return _badRequestError(error)
  } else if (!(error instanceof GraphQLError)) {
    // any other non-graphql error masked as internal error
    return _internalServerError(error)
  }

  return _defaultError(error)
}

export function extractUserAvatarUrl(user) {
  const avatarUrl = `${config.app.baseURL}/avatars/${user.id}.jpg`
  return avatarUrl
}

export function extractUserProfileUrl(user) {
  const githubProfile = _extractUserGithubProfile(user)
  return githubProfile ? githubProfile.profileUrl : null
}

function _extractUserGithubProfile(user) {
  return user ? ((user || {}).authProviderProfiles || {}).githubOAuth2 || {} : null
}

function _badRequestError(originalError) {
  const error = _defaultError(originalError)
  error.statusCode = originalError.code || 400
  error.type = originalError.type || originalError.message
  error.message = originalError.message
  return error
}

function _internalServerError(originalError) {
  return new LGInternalServerError(originalError)
}

function _defaultError(originalError) {
  const error = (originalError instanceof Error) ? originalError : new Error()
  error.statusCode = error.statusCode || error.code
  return error
}

export async function first(collection, iteratorFn) {
  let i = 0
  let result
  while (!result && i < collection.length) {
    result = await iteratorFn(collection[i])
    i++
  }
  return result
}
