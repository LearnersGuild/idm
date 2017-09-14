import test from 'ava'

import {runQuery} from 'src/test/graphql'
import {assertQueryError} from 'src/test/helpers'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($id: ID!) {
    getUserById(id: $id) {
      id name handle active inviteCode roles
    }
  }
`

test('returns correct user for valid id', async t => {
  t.plan(3)
  const inviteCode = 'invite-code-getUserById'
  const roles = ['staff']
  const [testUser1] = await factory.createMany('user', {roles, inviteCode}, 2)
  const result = await runQuery(query, fields, {id: testUser1.id})
  t.is(result.data.getUserById.id, testUser1.id)
  t.is(result.data.getUserById.inviteCode, inviteCode)
  t.deepEqual(result.data.getUserById.roles, roles)
})

test('throws an error if id is missing', async t => {
  await assertQueryError(
    t,
    fields,
    'not provided',
    query
  )
})

test('throws an error if id is not matched', async t => {
  await assertQueryError(
    t,
    fields,
    'not found',
    query,
    {id: 'fake.id'}
  )
})

test('throws an error if user is not signed-in', async t => {
  await assertQueryError(
    t,
    fields,
    'not authorized',
    query,
    {id: 'fake.id'},
    {currentUser: null}
  )
})
