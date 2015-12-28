import { combineReducers } from 'redux'

import { routeReducer } from 'redux-simple-router'

function identity(state = {} /* , action */) {
  return state
}

const rootReducer = combineReducers({
  routing: routeReducer,
  identity,
})

export default rootReducer
