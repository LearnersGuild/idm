import {reduxForm} from 'redux-form'
import {push} from 'react-router-redux'

import updateUser from '../actions/updateUser'
import UserFormComponent from '../components/UserForm'
import {buildURL} from '../util'

function validate({name, phone, dateOfBirth}) {
  const errors = {}
  if (!name || !name.match(/\w{3,}/)) {
    errors.name = 'Please use your full, legal name'
  }
  if (!phone || phone < 100000000 || phone > 9999999999) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  if (!dateOfBirth || !dateOfBirth.match(/\d{4}\-\d{2}\-\d{2}/)) {
    errors.dateOfBirth = 'Your birth date'
  }
  return errors
}

function saveUser(stateProps, dispatchProps) {
  const {auth: {lgJWT}} = stateProps
  const {dispatch, redirect, responseType} = dispatchProps
  const redirectLocation = redirect || '/'
  const afterSave = redirectLocation.match(/^\//) ? (
    () => {
      dispatch(push(redirectLocation))
    }
  ) : (
    () => {
      const redirectURL = responseType === 'token' ? buildURL(decodeURIComponent(redirectLocation), {lgJWT}) : redirectLocation
      /* global __CLIENT__, window */
      if (__CLIENT__) {
        window.location.href = redirectURL
      }
    }
  )
  return userInfo => {
    dispatch(updateUser(userInfo))
    afterSave()
  }
}

export default reduxForm({
  form: 'signUp',
  fields: ['id', 'email', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone'],
  validate,
}, state => ({
  auth: state.auth,
  initialValues: state.auth.currentUser, // TODO: upgrade redux-form when this is fixed: https://github.com/erikras/redux-form/issues/621#issuecomment-181898392
}), (dispatch, props) => props
, (stateProps, dispatchProps) => Object.assign({}, stateProps, dispatchProps, {
  onSubmit: saveUser(stateProps, dispatchProps),
}))(UserFormComponent)
