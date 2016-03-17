/* global Intl */
/* eslint new-cap: [2, {"capIsNewExceptions": ["DateTimeFormat"]}] */
/* eslint-disable react/jsx-handler-names */
import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'

import {Button} from 'react-toolbox/lib/button'
import DatePicker from 'react-toolbox/lib/date_picker'
import Dropdown from 'react-toolbox/lib/dropdown'
import FontIcon from 'react-toolbox/lib/font_icon'
import Input from 'react-toolbox/lib/input'

import styles from './UserForm.scss'

class UserForm extends Component {
  render() {
    const {
      fields: {email, handle, name, phone, dateOfBirth, timezone},
      handleSubmit,
      submitting,
      errors,
      buttonLabel,
      currentUser,
    } = this.props

    // email
    const emails = currentUser ? currentUser.emails.map(email => ({value: email, label: email})) : []

    // phone
    const handlePhoneKeyUp = e => {
      const fieldValue = e.target.value
      const phoneDigits = fieldValue.replace(/\D/g, '')
      const areaCode = phoneDigits.slice(0, 3)
      const prefix = phoneDigits.slice(3, 6)
      const suffix = phoneDigits.slice(6, 10)
      let formatted = String(areaCode)
      if (formatted.length > 2) {
        formatted += `-${prefix}`
      }
      if (formatted.length > 6) {
        formatted += `-${suffix}`
      }
      phone.onChange(formatted)
    }

    // dateOfBirth
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setYear(now.getFullYear() - 21)
    const dob = dateOfBirth.value ? new Date(dateOfBirth.value) : undefined
    const handleDateOfBirthChange = newDateOfBirth => {
      dateOfBirth.onChange(newDateOfBirth.toISOString())
    }

    // timezone
    const handleRefreshTimezoneFromBrowser = () => {
      timezone.onChange(Intl.DateTimeFormat().resolved.timeZone)
    }
    const tz = timezone.value || Intl.DateTimeFormat().resolved.timeZone

    return (
      <form onSubmit={handleSubmit}>
        <Dropdown
          auto
          icon="email"
          label="Email"
          source={emails}
          {...email}
          />
        <Input
          disabled
          icon="account_circle"
          type="text"
          label="Handle (from GitHub)"
          value={handle.defaultValue}
          />
        <Input
          icon="title"
          type="text"
          label="Name"
          {...name}
          />
        <Input
          icon="phone"
          type="tel"
          label="Phone"
          onKeyUp={handlePhoneKeyUp}
          {...phone}
          />
        <div className={`${styles.dateOfBirth} ${errors.dateOfBirth ? styles.dateOfBirthErrored : ''}`}>
          <DatePicker
            label="Date of Birth"
            maxDate={maxDate}
            value={dob}
            onChange={handleDateOfBirthChange}
            />
          <span className={styles.dateOfBirthError}>{errors.dateOfBirth}</span>
          <FontIcon value="today" className={styles.dateOfBirthIcon}/>
        </div>
        <div className={styles.timezone}>
          <Input
            disabled
            icon="place"
            type="text"
            label="Timezone (from browser)"
            {...timezone}
            value={tz}
            />
          <Button
            icon="refresh"
            onClick={handleRefreshTimezoneFromBrowser}
            />
        </div>
        <Button
          label={buttonLabel || 'Save'}
          primary
          raised
          disabled={submitting}
          type="submit"
          />
      </form>
    )
  }
}

UserForm.propTypes = {
  errors: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  buttonLabel: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
}

function validate({name, phone, dateOfBirth}) {
  const errors = {}
  if (!name || !name.match(/\w{2,}\ \w{2,}/)) {
    errors.name = 'Include both family and given name'
  }
  if (!phone || !phone.match(/(\d{3}\-?){2}\d{4}/)) {
    errors.phone = '3-digit area code and 7-digit phone number'
  }
  if (!dateOfBirth || !dateOfBirth.match(/\d{4}\-\d{2}\-\d{2}/)) {
    errors.dateOfBirth = 'Your birth date (YYYY-MM-DD)'
  }
  return errors
}

export default reduxForm({
  form: 'signUp',
  fields: ['email', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone'],
  validate,
}, state => ({
  currentUser: state.auth.currentUser,
  initialValues: state.auth.currentUser, // TODO: upgrade redux-form when this is fixed: https://github.com/erikras/redux-form/issues/621#issuecomment-181898392
}))(UserForm)
