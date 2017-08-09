const AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR'

export function authorizationError(message) {
  return {type: AUTHORIZATION_ERROR, message}
}
