import {reduxForm} from 'redux-form'

import updateUser from 'src/common/actions/updateUser'
import UserFormComponent from 'src/common/components/UserForm'

function validate({name, phone, dateOfBirth}) {
  const errors = {}
  if (!name || !name.match(/\w{3,}/)) {
    errors.name = 'Please use your full, legal name'
  }
  if (!phone || phone.length < 10) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  if (!dateOfBirth || !dateOfBirth.match(/\d{4}\-\d{2}\-\d{2}/)) {
    errors.dateOfBirth = 'Your birth date'
  }
  return errors
}

function saveUser(stateProps, dispatchProps) {
  const {dispatch, redirect, responseType} = dispatchProps
  return userInfo => {
    dispatch(updateUser(userInfo, redirect, responseType))
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
