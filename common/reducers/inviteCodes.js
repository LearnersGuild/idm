import {
  GET_INVITE_CODE_REQUEST,
  GET_INVITE_CODE_SUCCESS,
  GET_INVITE_CODE_FAILURE,
} from 'src/common/actions/getInviteCode'

const initialState = {
  codes: {},
  isBusy: false,
}

export function inviteCodes(state = initialState, action) {
  switch (action.type) {
    case GET_INVITE_CODE_REQUEST:
      return Object.assign({}, state, {
        isBusy: true,
      })
    case GET_INVITE_CODE_SUCCESS:
      return Object.assign({}, state, {
        isBusy: false,
        codes: {[action.code]: action.inviteCode},
      })
    case GET_INVITE_CODE_FAILURE:
      return Object.assign({}, state, {
        isBusy: false,
        codes: {[action.code]: false}
      })
    default:
      return state
  }
}
