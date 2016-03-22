import {combineReducers} from 'redux'

import {routerReducer} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'

import {auth} from './auth'
import {errors} from './errors'
import {inviteCodes} from './inviteCodes'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  auth,
  errors,
  inviteCodes,
})

export default rootReducer
