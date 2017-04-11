/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/jsx-handler-names */
import moment from 'moment-timezone'

import React, {Component, PropTypes} from 'react'

import Autocomplete from 'react-toolbox/lib/autocomplete'
import Avatar from 'react-toolbox/lib/avatar'
import {Button} from 'react-toolbox/lib/button'
import DatePicker from 'react-toolbox/lib/date_picker'
import Dropdown from 'react-toolbox/lib/dropdown'
import Input from 'react-toolbox/lib/input'
import Tooltip from 'react-toolbox/lib/tooltip'

import AvatarEditorDialog from './AvatarEditorDialog'
import styles from './index.css'

import {
  formatPartialPhoneNumber,
  stripNonE164Chars,
} from 'src/common/util/phoneNumber'

const TooltipAvatar = Tooltip(Avatar) // eslint-disable-line new-cap

// see: https://github.com/erikras/redux-form/issues/1441
const domOnlyProps = ({
  /* eslint-disable no-unused-vars */
  initialValue,
  autofill,
  onUpdate,
  valid,
  invalid,
  dirty,
  pristine,
  active,
  touched,
  visited,
  autofilled,
  /* eslint-enable no-unused-vars */
  ...domProps,
}) => domProps

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {avatarEditorActive: false}
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this)
    this.handleAvatarEditorSave = this.handleAvatarEditorSave.bind(this)
    this.handleAvatarEditorCancel = this.handleAvatarEditorCancel.bind(this)
    this.handleShowAvatarEditor = this.handleShowAvatarEditor.bind(this)
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

  handleAvatarEditorSave(imageURL) {
    const base64ImgData = imageURL.replace('data:image/jpeg;base64,', '')
    console.log({base64ImgData})
    this.setState({avatarEditorActive: false})
    this.props.handleSaveAvatar(base64ImgData)
  }

  handleAvatarEditorCancel() {
    this.setState({avatarEditorActive: false})
  }

  handleShowAvatarEditor(e) {
    e.preventDefault()
    this.setState({avatarEditorActive: true})
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
        <TooltipAvatar
          className={styles.avatar}
          image={currentUser.avatarUrl}
          onClick={this.handleShowAvatarEditor}
          tooltip="Click to Edit"
          tooltipPosition="horizontal"
          tooltipShowOnClick
          />
        <AvatarEditorDialog
          active={this.state.avatarEditorActive}
          user={currentUser}
          onCancel={this.handleAvatarEditorCancel}
          onSave={this.handleAvatarEditorSave}
          />
        <Input
          type="hidden"
          {...domOnlyProps(id)}
          />
        <Dropdown
          auto
          icon="email"
          label="Email"
          source={emails}
          {...domOnlyProps(email)}
          />
        <Input
          disabled
          icon="account_circle"
          type="text"
          label="Handle (from GitHub)"
          value={handle.value}
          />
        <Input
          icon="title"
          type="text"
          label="Full Legal Name"
          {...domOnlyProps(name)}
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
        <DatePicker
          icon="today"
          label="Date of Birth"
          maxDate={maxDate}
          name={dateOfBirth.name}
          value={dob}
          inputFormat={this.formatDateOfBirth}
          onChange={this.handleDateOfBirthChange}
          error={errors.dateOfBirth}
          />
        <Autocomplete
          icon="place"
          label="Timezone"
          multiple={false}
          suggestionMatch="anywhere"
          source={moment.tz.names()}
          {...domOnlyProps(timezone)}
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
  handleSaveAvatar: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  buttonLabel: PropTypes.string,
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
}

export default UserForm
