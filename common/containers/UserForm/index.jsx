import {reduxForm} from 'redux-form'
import moment from 'moment-timezone'

import updateUser from 'src/common/actions/updateUser'
import updateUserAvatar from 'src/common/actions/updateUserAvatar'
import UserFormComponent from 'src/common/components/UserForm'

function validate({name, phone, dateOfBirth, timezone}) {
  const errors = {}
  if (!name || !name.match(/\w{2,} \w{2,}/)) {
    errors.name = 'Please use your full, legal name'
  }
  if (!phone || phone.length < 10) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  if (!dateOfBirth || !dateOfBirth.match(/\d{4}\-\d{2}\-\d{2}/)) {
    errors.dateOfBirth = 'Your birth date'
  }
  if (!timezone || moment.tz.names().indexOf(timezone) < 0) {
    errors.timezone = 'Must be a valid timezone (e.g., America/Los_Angeles)'
  }
  return errors
}

function saveUser(stateProps, dispatchProps) {
  const {dispatch, redirect, responseType} = dispatchProps
  return userInfo => {
    dispatch(updateUser(userInfo, redirect, responseType))
  }
}

function saveUserAvatar(stateProps, dispatchProps) {
  const {dispatch} = dispatchProps
  return base64ImgData => {
    dispatch(updateUserAvatar(base64ImgData))
  }
}

export default reduxForm({
  form: 'signUp',
  fields: ['id', 'email', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone'],
  validate,
}, state => ({
  auth: state.auth,
  initialValues: {...state.auth.currentUser, timezone: state.auth.currentUser.timezone || moment.tz.guess()},
}), (dispatch, props) => props
, (stateProps, dispatchProps) => Object.assign({}, stateProps, dispatchProps, {
  onSubmit: saveUser(stateProps, dispatchProps),
  handleSaveAvatar: saveUserAvatar(stateProps, dispatchProps),
}))(UserFormComponent)
