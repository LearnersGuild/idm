import test from 'ava'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import SignUp from '../SignUp'

const defaultProps = {
  auth: {
    currentUser: null,
    isSigningIn: false,
  },
  inviteCodes: {
    isLoading: true,
    codes: {},
  },
  code: 'invitecode',
  onSubmit: () => null,
}

test('SignUp renders validation message when invite code is being loaded', t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(SignUp, Object.assign(defaultProps, {inviteCodes: {isLoading: true}}))
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.regex(rootNode.textContent, /validating/i)
})

test('SignUp renders error message when invite code is not valid', t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(SignUp, Object.assign(defaultProps, {
      inviteCodes: {
        isLoading: false,
        codes: {
          f6sa15: false,
        }
      },
      code: 'f6sa15',
    }))
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.regex(rootNode.textContent, /invalid/i)
})

test('SignUp renders authenticate button if user has not authenticated', t => {
  t.plan(1)

  const root = TestUtils.renderIntoDocument(
    React.createElement(SignUp, Object.assign(defaultProps, {
      auth: {
        currentUser: null,
      },
      inviteCodes: {
        isLoading: false,
        codes: {
          f6sa15: true,
        }
      },
      code: 'f6sa15',
    }))
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.regex(rootNode.textContent, /authenticate/)
})

test.todo('SignUp renders user form if user has authenticated (needs container for UserForm)')
