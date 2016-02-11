import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'

import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'

class SignUpForm extends Component {

  render() {
    const {
      fields: {email, name},
      handleSubmit,
      onSubmit,
      submitting,
    } = this.props

    return (
      <form
        onSubmit={
          handleSubmit(() => {
            onSubmit()
          })
        }
        >
        <TextField
          floatingLabelText="Email"
          hintText="me@example.com"
          errorText={email.valid ? null : 'This field is required'}
          {...email}
          /><br/>
        <TextField
          floatingLabelText="Name"
          hintText="Ivanna Lernkoding"
          errorText={name.valid ? null : 'Please enter your full name'}
          {...name}
          /><br/>
        <RaisedButton
          label="Sign Up"
          primary
          disabled={submitting}
          style={{margin: 12}}
          type="submit"
          />
      </form>
    )
  }
}

SignUpForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func/* .isRequired */,
  submitting: PropTypes.bool.isRequired,
}

export default reduxForm({
  form: 'signUp',
  fields: ['email', 'name'],
})(SignUpForm)
