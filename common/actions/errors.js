const AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR'
const DISMISS_ERROR = 'DISMISS_ERROR'

export function authorizationError(message) {
  return {type: AUTHORIZATION_ERROR, message}
}

export function dismissError(index) {
  return {type: DISMISS_ERROR, index}
}
