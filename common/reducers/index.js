import {combineReducers} from 'redux'

import {routerReducer} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'

import {auth} from './auth'
import {errors} from './errors'
import {inviteCodes} from './inviteCodes'
import {users} from './users'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  auth,
  errors,
  inviteCodes,
  users
})

export default rootReducer
