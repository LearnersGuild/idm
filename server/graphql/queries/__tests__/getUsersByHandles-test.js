import test from 'ava'

import {downcaseTrimTo21Chars} from 'src/common/util'
import {runQuery} from 'src/test/graphql'
import {assertQueryError} from 'src/test/helpers'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($handles: [String]!) {
    getUsersByHandles(handles: $handles) {
      id name handle active
    }
  }
`

test('returns array of correct users for array of valid handles', async t => {
  const roles = ['staff']
  const inviteCode = 'invite-code-getUsersByHandles'
  const users = await factory.createMany('user', {roles, inviteCode}, 2)

  t.plan(1 + users.length)

  const handles = users.map(u => u.handle)
  const result = await runQuery(query, fields, {handles})
  const matchedUsers = result.data.getUsersByHandles

  t.is(matchedUsers.length, users.length)

  users.forEach(user => {
    t.truthy(matchedUsers.find(match => match.handle === user.handle))
  })
})

test('returns empty array for empty array of handles', async t => {
  const result = await runQuery(query, fields, {handles: []})
  t.is(result.data.getUsersByHandles.length, 0)
})

test('throws an error if handles is missing', async t => {
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
    {handles: ['fake.handle']},
    {currentUser: null}
  )
})

test('returns the correct users for Slack-compatible handles', async t => {
  const overwriteObjs = [{
    handle: 'HasUppercase',
  }, {
    handle: 'isLongerThanTwentyOneCharacters',
  }]
  const users = await factory.createMany('user', overwriteObjs, 2)
  const {data: {getUsersByHandles: matchedUsers}} = await runQuery(
    query,
    fields,
    {handles: users.map(user => downcaseTrimTo21Chars(user.handle))}
  )
  t.is(matchedUsers.length, users.length, 'found wrong number of users')
})
