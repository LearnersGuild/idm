import {GraphQLError} from 'graphql/error'

export function formatServerError(err = {}) {
  const serverError = (err instanceof Error) ? err : new Error()

  // TODO: set 4xx status codes as appropriate for certain types of
  // client errors, such as db constraint violations, etc.
  if (/Reql\w+Error/.test(serverError.name) || (serverError.originalError &&
      /Reql\w+Error/.test(serverError.originalError.name))) {
    serverError.statusCode = 500
  } else if (!(serverError instanceof GraphQLError)) {
    // only set default statusCode for non-GraphQLError instances
    serverError.statusCode = err.code || 500
  }

  if (serverError.statusCode === 500) {
    serverError.message = 'An internal server error occurred'
    serverError.type = 'Internal Server Error'

    if (serverError.hasOwnProperty('originalError')) {
      delete serverError.originalError
    }
  }

  return serverError
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
