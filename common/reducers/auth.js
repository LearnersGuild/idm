import {AUTHENTICATE} from 'src/common/actions/authenticate'
import {UPDATE_JWT} from 'src/common/actions/updateJWT'
import {UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE} from 'src/common/actions/updateUser'

const initialState = {
  currentUser: null,
  lgJWT: null,
  isAdmin: false,
  isBusy: false,
}

export function auth(state = initialState, action) {
  const currentUser = Object.assign({}, state.currentUser, action.currentUser)
  const isAdmin = currentUser.roles ? currentUser.roles.includes('admin') : false
  switch (action.type) {
    case AUTHENTICATE:
      return Object.assign({}, state, {
        isBusy: true,
      })
    case UPDATE_USER_REQUEST:
      return Object.assign({}, state, {
        isBusy: true,
      })
    case UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        currentUser,
        isAdmin,
        isBusy: false,
      })
    case UPDATE_USER_FAILURE:
      console.error('Update user FAILURE:', action.error)
      return Object.assign({}, state, {
        isBusy: false,
      })
    case UPDATE_JWT:
      return Object.assign({}, state, {
        isAdmin,
        lgJWT: action.lgJWT,
      })
    default:
      return state
  }
}
