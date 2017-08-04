import {
  FIND_USERS_REQUEST,
  FIND_USERS_SUCCESS,
  FIND_USERS_FAILURE,
} from 'src/common/actions/findUsers'

const initialState = {
  users: {},
  isBusy: false,
}

export function users(state = initialState, action) {
  switch (action.type) {
    case FIND_USERS_REQUEST:
      return Object.assign({}, state, {
        isBusy: true,
        users: []
      })
    case FIND_USERS_SUCCESS:
      return Object.assign({}, state, {
        isBusy: false,
        users: action.users
      })
    case FIND_USERS_FAILURE:
      return Object.assign({}, state, {
        isBusy: false,
        users: []
      })
    default:
      return state
  }
}
