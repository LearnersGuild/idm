import test from 'ava'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import {runMutation} from 'src/test/graphql'

const r = connect()

import api from '../mutation'

const mutation = 'mutation($inviteCode: InputInviteCode!) { createInviteCode(inviteCode: $inviteCode) { id code active } }'
const inputInviteCode = {
  code: 'test-code',
  description: 'whee',
  roles: ['role1', 'role2'],
}
const admin = {id: 'me', handle: 'me', roles: ['admin']}
test.before(async () => {
  await resetData()
})

test.after(async () => {
  await cleanupDB()
})

test('createInviteCode: creates the invite code correctly', async t => {
  t.plan(3)

  await runMutation(
    mutation,
    api,
    {inviteCode: inputInviteCode},
    {currentUser: admin}
  )
  const savedInviteCode = await r.table('inviteCodes').getAll(inputInviteCode.code, {index: 'code'}).nth(0)

  t.is(savedInviteCode.code, inputInviteCode.code)
  t.is(savedInviteCode.description, inputInviteCode.description)
  t.deepEqual(savedInviteCode.roles, inputInviteCode.roles)
})

test('createInviteCode: defaults active to true and permanent to false', async t => {
  t.plan(2)

  await runMutation(
    mutation,
    api,
    {inviteCode: inputInviteCode},
    {currentUser: admin}
  )
  const savedInviteCode = await r.table('inviteCodes').getAll(inputInviteCode.code, {index: 'code'}).nth(0)

  t.is(savedInviteCode.active, true)
  t.is(savedInviteCode.permanent, false)
})
