import { combineReducers } from 'redux'

import { routeReducer } from 'redux-simple-router'

const rootReducer = combineReducers({
  routing: routeReducer,
})

export default rootReducer
