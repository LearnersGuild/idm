import test from 'ava'
import React from 'react'
import {shallow} from 'enzyme'

import SignUp from 'src/common/components/SignUp'

test('SignUp renders validation message when invite code is being loaded', t => {
  t.plan(1)

  const props = getSignupProps({inviteCodes: {isBusy: true}})
  const root = shallow(<SignUp {...props}/>)
  const validationMsgs = root.findWhere(node => node.text() === 'Validating invite code ...')

  t.is(validationMsgs.length, 1, '1 validation message found')
})

test('SignUp renders error message when invite code is not valid', t => {
  t.plan(1)

  const props = getSignupProps({
    inviteCodes: {isBusy: false, codes: {f6sa15: false}},
    code: 'f6sa15',
  })

  const root = shallow(<SignUp {...props}/>)
  const errorMsgs = root.findWhere(node => node.text() === 'Invalid invite code.')

  t.is(errorMsgs.length, 1, '1 error message found')
})

test('SignUp renders authenticate button if user has not authenticated', t => {
  t.plan(1)

  const props = getSignupProps({
    auth: {currentUser: null},
    inviteCodes: {isBusy: false, codes: {f6sa15: true}},
    code: 'f6sa15',
  })

  const root = shallow(<SignUp {...props}/>)
  const authButtons = root.find('AuthButton')

  t.is(authButtons.length, 1, '1 Authenticate button found')
})

test('SignUp renders user form if user has authenticated', t => {
  t.plan(1)

  const props = getSignupProps({
    auth: {currentUser: {name: 'Awsm Person'}},
    inviteCodes: {isBusy: false, codes: {f6sa15: true}},
    code: 'f6sa15',
  })

  const root = shallow(<SignUp {...props}/>)
  const forms = root.find('.SignUp--UserForm')

  t.is(forms.length, 1, '1 form found')
})

function getSignupProps(defaultProps) {
  const {
    auth = {},
    inviteCodes = {},
    location = {},
    code,
    onSubmitCode,
  } = defaultProps || {}

  return {
    auth: {
      currentUser: auth.currentUser || null,
      isBusy: typeof inviteCodes.isBusy === 'boolean' ? inviteCodes.isBusy : false,
    },
    inviteCodes: {
      codes: inviteCodes.codes || {},
      isBusy: typeof inviteCodes.isBusy === 'boolean' ? inviteCodes.isBusy : true,
    },
    location: {
      query: location.query || {}
    },
    code: code || 'invitecode',
    onSubmitCode: onSubmitCode ? onSubmitCode : () => null,
  }
}
