import { combineReducers } from 'redux'

function identity(state = {}, action) {
  return state
}

const rootReducer = combineReducers({
  identity
})

export default rootReducer
