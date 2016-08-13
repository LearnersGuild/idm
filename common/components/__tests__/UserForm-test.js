import test from 'ava'
import React from 'react'
import {shallow} from 'enzyme'

import UserForm from 'src/common/components/UserForm'

test('UserForm renders emails into dropdown', t => {
  t.plan(1)

  const {auth, fields} = getMockData()
  const props = {auth, fields, submitting: false, errors: {}, handleSubmit: () => null}

  const root = shallow(React.createElement(UserForm, props))
  const emailDropdown = root.find('Dropdown')
  const emailDropdownHtml = emailDropdown.html()
  const matchedEmailItems = auth.currentUser.emails.filter(email => {
    return emailDropdownHtml.includes(`<li>${email}</li>`)
  })

  t.is(matchedEmailItems.length, auth.currentUser.emails.length)
})

test('UserForm updates fields when they are changed', t => {
  const changesToTest = ['id', 'name', 'phone', 'timezone']

  t.plan(changesToTest.length)

  const {auth, fields, fieldsChanged} = getMockData()
  const props = {auth, fields, submitting: false, errors: {}, handleSubmit: () => null}
  const root = shallow(React.createElement(UserForm, props))
  const inputs = root.find('Input')

  inputs.forEach(input => input.simulate('change'))

  changesToTest.forEach(key => t.true(fieldsChanged[key]))
})

test('UserForm submits form when button is clicked', t => {
  t.plan(1)

  let submitted = false
  const {auth, fields} = getMockData()
  const props = {
    auth,
    fields,
    errors: {},
    submitting: false,
    handleSubmit: () => {
      submitted = true
    },
  }

  const root = shallow(React.createElement(UserForm, props))
  const form = root.find('form')
  form.simulate('submit')

  t.true(submitted)
})

function getMockData() {
  const fieldsChanged = {
    id: false,
    email: false,
    handle: false,
    name: false,
    phone: false,
    dateOfBirth: false,
    timezone: false,
  }

  const changeField = name => {
    return () => {
      fieldsChanged[name] = true
    }
  }

  const mockField = {
    defaultValue: null,
    initialValue: null,
    invalid: false,
  }

  return {
    fieldsChanged,

    fields: {
      id: {...mockField, name: 'id', onChange: changeField('id')},
      email: {...mockField, name: 'email', onChange: changeField('email')},
      handle: {...mockField, name: 'handle', onChange: changeField('handle')},
      name: {...mockField, name: 'name', onChange: changeField('name')},
      phone: {...mockField, name: 'phone', onChange: changeField('phone')},
      dateOfBirth: {...mockField, name: 'dateOfBirth', onChange: changeField('dateOfBirth')},
      timezone: {...mockField, name: 'timezone', onChange: changeField('timezone')},
    },

    auth: {
      currentUser: {
        id: 'abcd1234',
        email: 'me@example.com',
        emails: ['me@example.com', 'me2@example.com'],
        handle: 'me',
        name: 'Me',
        phone: null,
        dateOfBirth: null,
        timezone: null,
      },
      isBusy: false,
    },
  }
}
