import test from 'ava'

import {connect} from 'src/db'
import {runMutation} from 'src/test/graphql'

const r = connect()

import fields from '../index'

const mutation = `
  mutation($inviteCode: InputInviteCode!) {
    createInviteCode(inviteCode: $inviteCode) {
      id code active
    }
  }
`

test.serial('creates the invite code correctly', async t => {
  t.plan(5)

  const inputInviteCode = {
    code: 'test-code',
    description: 'whee',
    roles: ['role1', 'role2'],
  }

  await runMutation(
    mutation,
    fields,
    {inviteCode: inputInviteCode},
    {currentUser: {id: 'me', handle: 'me', roles: ['admin']}} // admin user
  )

  const savedInviteCode = await r.table('inviteCodes')
    .getAll(inputInviteCode.code, {index: 'code'})
    .nth(0)

  t.is(savedInviteCode.code, inputInviteCode.code)
  t.is(savedInviteCode.description, inputInviteCode.description)
  t.is(savedInviteCode.active, true)
  t.is(savedInviteCode.permanent, false)
  t.deepEqual(savedInviteCode.roles, inputInviteCode.roles)
})
