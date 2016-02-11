import {combineReducers} from 'redux'

import {routeReducer} from 'redux-simple-router'
import {reducer as formReducer} from 'redux-form'

const rootReducer = combineReducers({
  routing: routeReducer,
  form: formReducer,
})

export default rootReducer
