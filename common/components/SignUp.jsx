import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'

import Input from 'react-toolbox/lib/input'
import {Button} from 'react-toolbox/lib/button'
import {Card} from 'react-toolbox/lib/card'

import styles from './SignInUp.scss'

class SignUpForm extends Component {

  render() {
    const {
      fields: {email, name},
      handleSubmit,
      onSubmit,
      submitting,
    } = this.props

    return (
      <Card className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.lgIcon} src="https://icons.learnersguild.org/apple-touch-icon-60x60.png"/>
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
        </div>
      </Card>
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
