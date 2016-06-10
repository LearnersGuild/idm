export const AUTHENTICATE = 'AUTHENTICATE'

export function authenticateAction(authURL) {
  return {type: AUTHENTICATE, authURL}
}

export default function redirect(authURL) {
  return dispatch => {
    dispatch(authenticateAction(authURL))
    /* global __CLIENT__, window */
    if (__CLIENT__) {
      window.location.href = authURL
    }
  }
}
