import test from 'ava'

import {downcaseTrimTo21Chars} from 'src/common/util'
import {runQuery} from 'src/test/graphql'
import {assertQueryError} from 'src/test/helpers'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($identifier: String!) {
    getUser(identifier: $identifier) {
      id name handle active email
    }
  }
`

test('returns correct user for a Slack-compatible handle', async t => {
  const user = await factory.create('user', {handle: 'isMuchLongerThanTwentyOneCharacters'})
  const result = await runQuery(query, fields, {
    identifier: downcaseTrimTo21Chars(user.handle)
  })
  t.is(result.data.getUser.email, user.email, 'users do not match')
})

test('returns correct user for valid identifier', async t => {
  const roles = ['learner']
  const inviteCode = 'test-code-getUser'
  const [testUser1] = await factory.createMany('user', {roles, inviteCode}, 2)
  const result = await runQuery(query, fields, {identifier: testUser1.id})
  t.is(result.data.getUser.id, testUser1.id)
})

test('returns correct user for valid handle', async t => {
  const roles = ['learner']
  const inviteCode = 'test-code-getUser'
  const [testUser1] = await factory.createMany('user', {roles, inviteCode}, 2)
  const result = await runQuery(query, fields, {identifier: testUser1.handle})
  t.is(result.data.getUser.id, testUser1.id)
})

test('throws an error if identifier is missing', async t => {
  await assertQueryError(
    t,
    fields,
    'not provided',
    query
  )
})

test('throws an error if identifier is not matched', async t => {
  await assertQueryError(
    t,
    fields,
    'not found',
    query,
    {identifier: 'fake.id'}
  )
})

test('throws an error if user is not signed-in', async t => {
  await assertQueryError(
    t,
    fields,
    'not authorized',
    query,
    {identifier: ''},
    {currentUser: null}
  )
})
