import {DISMISS_ERROR} from 'src/common/actions/errors'
import {UPDATE_USER_FAILURE} from 'src/common/actions/updateUser'
import {UPDATE_USER_AVATAR_FAILURE} from 'src/common/actions/updateUserAvatar'
import {GET_INVITE_CODE_FAILURE} from 'src/common/actions/getInviteCode'

const initialState = {
  messages: [],
}

function appendMessage(state, message) {
  const messages = state.messages.slice(0)
  messages.push(message)
  return messages
}

function removeMessage(state, index) {
  const messages = state.messages.slice(0)
  messages.splice(index, 1)
  return messages
}

export function errors(state = initialState, action) {
  switch (action.type) {
    case DISMISS_ERROR:
      return Object.assign({}, state, {
        messages: removeMessage(state, action.index)
      })
    case UPDATE_USER_FAILURE:
    case UPDATE_USER_AVATAR_FAILURE:
    case GET_INVITE_CODE_FAILURE:
      return Object.assign({}, state, {
        messages: appendMessage(state, action.error),
      })
    default:
      return state
  }
}
