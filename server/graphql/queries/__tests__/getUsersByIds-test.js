import test from 'ava'

import {runQuery} from 'src/test/graphql'
import {assertQueryError} from 'src/test/helpers'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($ids: [ID]!) {
    getUsersByIds(ids: $ids) {
      id name handle active
    }
  }
`

test('returns array of correct users for array of valid ids', async t => {
  const inviteCode = 'invite-code-getUsersByIds'
  const roles = ['staff']
  const users = await factory.createMany('user', {roles, inviteCode}, 2)

  t.plan(1 + users.length)

  const ids = users.map(u => u.id)
  const result = await runQuery(query, fields, {ids})
  const matchedUsers = result.data.getUsersByIds

  t.is(matchedUsers.length, users.length)

  users.forEach(user => (
    t.truthy(matchedUsers.find(match => match.id === user.id))
  ))
})

test('returns empty array for empty array of ids', async t => {
  const result = await runQuery(query, fields, {ids: []})
  t.is(result.data.getUsersByIds.length, 0)
})

test('throws an error if ids is missing', async t => {
  await assertQueryError(
    t,
    fields,
    'not provided',
    query
  )
})

test('throws an error if user is not signed-in', async t => {
  await assertQueryError(
    t,
    fields,
    'not authorized',
    query,
    {ids: ['fake.id']},
    {currentUser: null}
  )
})
