/* global sessionStorage */
import {SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE} from '../actions/signIn'

const initialState = {
  currentUser: null,
  isSigningIn: false,
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN_REQUEST:
      return Object.assign({}, state, {
        isSigningIn: true,
      })
    case SIGN_IN_SUCCESS:
      sessionStorage.currentUser = JSON.stringify(action.user)
      return Object.assign({}, state, {
        currentUser: action.user,
        isSigningIn: false,
      })
    case SIGN_IN_FAILURE:
      console.error('Sign-in FAILURE:', action.error)
      delete sessionStorage.currentUser
      return Object.assign({}, state, {
        currentUser: null,
        isSigningIn: false,
      })
    default:
      return state
  }
}
