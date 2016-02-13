/* eslint-disable no-undef */
import {pushPath} from 'redux-simple-router'

const Auth0 = __CLIENT__ ? require('auth0-js') : null

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE'

function signInRequest(connections) {
  return {type: SIGN_IN_REQUEST, connections}
}

function signInSuccess(user) {
  return {type: SIGN_IN_SUCCESS, user}
}

function signInFailure(error) {
  return {type: SIGN_IN_FAILURE, error}
}

export default function signIn(connection, next = '/') {
  return dispatch => {
    dispatch(signInRequest(connection))

    if (__CLIENT__) {
      const auth0 = new Auth0({
        domain: 'learnersguild.auth0.com',
        callbackOnLocationHash: true,
        clientID: 'dmudsrKTLmeTLuEqlK7n9DF2aNPgbGHR', // TODO: use environment
      })
      auth0.login({connection, popup: true}, (err, profile, idToken, accessToken, state) => {
        if (err) {
          dispatch(signInFailure(`Error signing-in: ${err.message}`))
        }
        const user = {profile, idToken, accessToken, state}
        dispatch(signInSuccess(user))
        dispatch(pushPath(next))
      })
    } else {
      dispatch(signInFailure("Can't use auth0-js to sign-in on server."))
    }
  }
}
