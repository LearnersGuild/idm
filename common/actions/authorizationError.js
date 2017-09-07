export const AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR'

export default function authorizationError(message) {
  return {type: AUTHORIZATION_ERROR, message}
}
