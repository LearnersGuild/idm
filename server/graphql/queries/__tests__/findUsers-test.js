import test from 'ava'

import {runQuery} from 'src/test/graphql'
import {assertQueryError} from 'src/test/helpers'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($identifiers: [String]) {
    findUsers(identifiers: $identifiers) {
      id name handle active
    }
  }
`

test('returns correct user for combination of ids and handles', async t => {
  t.plan(4)
  const roles = ['admin']
  const inviteCode = 'test-code-findUsers'
  const [testUser1, testUser2, testUser3] = await factory.createMany('user', {roles, inviteCode}, 5)
  const identifiers = [testUser1.id, testUser2.handle, testUser3.id]
  const result = await runQuery(query, fields, {identifiers})
  t.is(result.data.findUsers.length, 3)
  t.truthy(result.data.findUsers.find(u => u.id === testUser1.id))
  t.truthy(result.data.findUsers.find(u => u.handle === testUser2.handle))
  t.truthy(result.data.findUsers.find(u => u.id === testUser3.id))
})

test('returns only unique users for duplicate identifiers', async t => {
  t.plan(2)
  const roles = ['admin']
  const inviteCode = 'test-code-findUsers-2'
  const [testUser1] = await factory.createMany('user', {roles, inviteCode}, 2)
  const identifiers = [testUser1.id, testUser1.handle]
  const result = await runQuery(query, fields, {identifiers})
  t.is(result.data.findUsers.length, 1)
  t.is(result.data.findUsers[0].id, testUser1.id)
})

test('returns all users if no identifiers provided', async t => {
  const roles = ['admin']
  const inviteCode = 'test-code-findUsers-3'
  const users = await factory.createMany('user', {roles, inviteCode}, 3)
  const result = await runQuery(query, fields)
  users.forEach(user => (
    t.truthy(result.data.findUsers.find(u => user.id === u.id))
  ))
})

test('returns empty array of users for empty array of identifiers', async t => {
  const result = await runQuery(query, fields, {identifiers: []})
  t.is(result.data.findUsers.length, 0)
})

test('throws an error if user is not signed-in', async t => {
  await assertQueryError(
    t,
    fields,
    'not authorized',
    query,
    null,
    {currentUser: null}
  )
})
