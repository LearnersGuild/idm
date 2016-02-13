import {combineReducers} from 'redux'

import {routeReducer} from 'redux-simple-router'
import {reducer as formReducer} from 'redux-form'

import {auth} from './auth'

const rootReducer = combineReducers({
  routing: routeReducer,
  form: formReducer,
  auth,
})

export default rootReducer
