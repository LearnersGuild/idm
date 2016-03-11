import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'

import Input from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'

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
        <Input
          type="text"
          label="Email"
          error={email.valid ? null : 'This field is required'}
          {...email}
          /><br/>
        <Input
          type="text"
          label="Name"
          error={name.valid ? null : 'Please enter your full name'}
          {...name}
          /><br/>
        <Button
          label="Sign Up"
          primary
          raised
          disabled={submitting}
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
