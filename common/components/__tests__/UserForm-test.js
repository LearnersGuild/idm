import test from 'ava'

import React from 'react'
// import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import Dropdown from 'react-toolbox/lib/dropdown'

import UserForm from '../UserForm'

const fieldsChanged = {
  id: false,
  email: false,
  handle: false,
  name: false,
  phone: false,
  dateOfBirth: false,
  timezone: false,
}
const mockField = {
  defaultValue: null,
  initialValue: null,
  invalid: false,
}
const changeField = name => {
  return () => {
    fieldsChanged[name] = true
  }
}
const mockFields = {
  id: Object.assign({}, mockField, {name: 'id', onChange: changeField('id')}),
  email: Object.assign({}, mockField, {name: 'email', onChange: changeField('email')}),
  handle: Object.assign({}, mockField, {name: 'handle', onChange: changeField('handle')}),
  name: Object.assign({}, mockField, {name: 'name', onChange: changeField('name')}),
  phone: Object.assign({}, mockField, {name: 'phone', onChange: changeField('phone')}),
  dateOfBirth: Object.assign({}, mockField, {name: 'dateOfBirth', onChange: changeField('dateOfBirth')}),
  timezone: Object.assign({}, mockField, {name: 'timezone', onChange: changeField('timezone')}),
}
const mockAuth = {
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
}

test('UserForm renders emails into dropdown', t => {
  t.plan(1)

  const props = {
    auth: Object.assign({}, mockAuth),
    fields: Object.assign({}, mockFields),
    errors: {},
  }
  const root = TestUtils.renderIntoDocument(
    React.createElement(UserForm, props)
  )
  const emailDropdown = TestUtils.findRenderedComponentWithType(root, Dropdown)
  const selectItems = TestUtils.scryRenderedDOMComponentsWithTag(emailDropdown, 'li')

  t.is(selectItems.length, 2)
})

test('UserForm updates fields when they are changed', t => {
  const changesToTest = ['email', 'name', 'phone', 'timezone']
  t.plan(changesToTest.length)

  const props = {
    auth: Object.assign({}, mockAuth),
    fields: Object.assign({}, mockFields),
    errors: {},
  }
  const root = TestUtils.renderIntoDocument(
    React.createElement(UserForm, props)
  )
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(root, 'input')
  inputs.forEach(input => {
    if (changesToTest.indexOf(input.name) >= 0) {
      TestUtils.Simulate.change(input)
    }
  })

  changesToTest.forEach(key => {
    t.truthy(fieldsChanged[key])
  })
})

test('UserForm submits form when button is clicked', t => {
  t.plan(1)

  let submitted = false
  const props = {
    auth: Object.assign({}, mockAuth),
    fields: Object.assign({}, mockFields),
    errors: {},
    handleSubmit: () => {
      submitted = true
    },
  }
  const root = TestUtils.renderIntoDocument(
    React.createElement(UserForm, props)
  )
  const form = TestUtils.findRenderedDOMComponentWithTag(root, 'form')
  TestUtils.Simulate.submit(form)

  t.truthy(submitted)
})
