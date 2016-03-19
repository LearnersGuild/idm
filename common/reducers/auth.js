import {UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE} from '../actions/updateUser'

const initialState = {
  currentUser: null,
  isSigningIn: false,
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_REQUEST:
      return Object.assign({}, state, {
        isSigningIn: true,
      })
    case UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        currentUser: Object.assign({}, state.currentUser, action.currentUser),
        isSigningIn: false,
      })
    case UPDATE_USER_FAILURE:
      console.error('Update user FAILURE:', action.error)
      return Object.assign({}, state, {
        isSigningIn: false,
      })
    default:
      return state
  }
}
