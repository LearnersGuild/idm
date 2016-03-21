import {combineReducers} from 'redux'

import {routerReducer} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'

import {auth} from './auth'
import {errors} from './errors'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  auth,
  errors,
})

export default rootReducer
