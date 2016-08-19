/* eslint-disable react/jsx-handler-names */
import moment from 'moment-timezone'

import React, {Component, PropTypes} from 'react'

import Autocomplete from 'react-toolbox/lib/autocomplete'
import {Button} from 'react-toolbox/lib/button'
import DatePicker from 'react-toolbox/lib/date_picker'
import Dropdown from 'react-toolbox/lib/dropdown'
import FontIcon from 'react-toolbox/lib/font_icon'
import Input from 'react-toolbox/lib/input'

import {
  formatPartialPhoneNumber,
  stripNonE164Chars,
} from '../util/phoneNumber'

import styles from './UserForm.scss'

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this)
  }

  handlePhoneChange(newPhone) {
    const {
      fields: {phone}
    } = this.props

    phone.onChange(stripNonE164Chars(newPhone || ''))
  }

  handleDateOfBirthChange(date) {
    const {
      fields: {dateOfBirth}
    } = this.props

    // ensure that the date is stored as UTC
    const dobWithoutTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0))
    dateOfBirth.onChange(dobWithoutTime.toISOString().slice(0, 10))
  }

  formatDateOfBirth(date) {
    return date.toISOString().slice(0, 10)
  }

  hasErrors() {
    return Object.keys(this.props.errors).length > 0
  }

  render() {
    const {
      fields: {id, email, handle, name, phone, dateOfBirth, timezone},
      handleSubmit,
      submitting,
      errors,
      buttonLabel,
      auth: {isBusy, currentUser},
    } = this.props

    const emails = currentUser ? currentUser.emails.map(email => ({value: email, label: email})) : []
    const phoneNum = formatPartialPhoneNumber(phone.value)
    const now = new Date()
    const maxDate = new Date(now)
    maxDate.setYear(now.getFullYear() - 21)   // learners must be 21 years old
    const dob = dateOfBirth.value ? new Date(dateOfBirth.value) : undefined

    return (
      <form onSubmit={handleSubmit}>
        <Input
          type="hidden"
          {...id}
          />
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
          label="Full Legal Name"
          {...name}
          />
        <Input
          icon="phone"
          type="tel"
          label="Phone"
          name={phone.name}
          value={phoneNum}
          onChange={this.handlePhoneChange}
          error={errors.phone}
          />
        <div className={styles.dateOfBirth}>
          <DatePicker
            label="Date of Birth"
            maxDate={maxDate}
            name={dateOfBirth.name}
            value={dob}
            inputFormat={this.formatDateOfBirth}
            onChange={this.handleDateOfBirthChange}
            error={errors.dateOfBirth}
            />
          <FontIcon value="today" className={styles.dateOfBirthIcon}/>
        </div>
        <Autocomplete
          icon="place"
          label="Timezone"
          multiple={false}
          suggestionMatch="anywhere"
          source={moment.tz.names()}
          {...timezone}
          />
        <Button
          label={buttonLabel || 'Save'}
          primary
          raised
          disabled={submitting || isBusy || this.hasErrors()}
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
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
}

export default UserForm
