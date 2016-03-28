import {reduxForm} from 'redux-form'

import updateUser from '../actions/updateUser'
import UserFormComponent from '../components/UserForm'

function validate({name, phone, dateOfBirth}) {
  const errors = {}
  if (!name || !name.match(/\w{2,}\ \w{2,}/)) {
    errors.name = 'Include both family and given name'
  }
  if (!phone || phone < 100000000 || phone > 9999999999) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  if (!dateOfBirth || !dateOfBirth.match(/\d{4}\-\d{2}\-\d{2}/)) {
    errors.dateOfBirth = 'Your birth date'
  }
  return errors
}

function saveUser(dispatch) {
  return userInfo => {
    dispatch(updateUser(userInfo, '/'))
  }
}

export default reduxForm({
  form: 'signUp',
  fields: ['id', 'email', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone'],
  validate,
}, state => ({
  auth: state.auth,
  initialValues: state.auth.currentUser, // TODO: upgrade redux-form when this is fixed: https://github.com/erikras/redux-form/issues/621#issuecomment-181898392
}), dispatch => ({
  onSubmit: saveUser(dispatch),
}))(UserFormComponent)
