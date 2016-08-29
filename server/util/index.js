import {GraphQLError} from 'graphql/error'

export function formatServerError(error = new Error()) {
  if (/Reql\w+Error/.test(error.name) || (error.originalError &&
      /Reql\w+Error/.test(error.originalError.name))) {
    // RethinkDb errors masked as internal errors
    return _internalServerError()
  } else if (error.name === 'BadRequestError') {
    return _badRequestError(error)
  } else if (!(error instanceof GraphQLError)) {
    // any other non-graphql error masked as internal error
    return _internalServerError()
  }

  return _defaultError(error)
}

export function extractUserAvatarUrl(user) {
  const githubProfile = _extractUserGithubProfile(user)
  return githubProfile && githubProfile.photos && githubProfile.photos.length ?
    githubProfile.photos[0].value : null
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
  const error = _defaultError(originalError)
  error.statusCode = 500
  error.message = 'An internal server error occurred'
  error.type = 'Internal Server Error'
  return error
}

function _defaultError(originalError) {
  const error = (originalError instanceof Error) ? originalError : new Error()
  error.statusCode = error.statusCode || error.code
  return error
}
