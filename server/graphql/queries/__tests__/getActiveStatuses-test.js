import test from 'ava'

import {runQuery} from 'src/test/graphql'
import factory from 'src/test/factories'

import fields from '../index'

const query = `
  query($ids: [ID]!) {
    getActiveStatuses(ids: $ids) {
      id active
    }
  }
`

test('returns empty array for empty array', async t => {
  const result = await runQuery(query, fields, {ids: []})
  t.is(result.data.getActiveStatuses.length, 0)
})

test('returns the status for all IDs', async t => {
  t.plan(2)
  const roles = ['admin']
  const inviteCode = 'test-code-getActiveStatuses'
  const users = await factory.createMany('user', {roles, inviteCode}, 3)
  const ids = users.map(_ => _.id)
  const result = await runQuery(query, fields, {ids})
  const statuses = result.data.getActiveStatuses
  const attributes = Object.keys(statuses[0])
  t.is(statuses.length, users.length)
  t.deepEqual(attributes, ['id', 'active'])
})

test('does not require an authenticated user', async t => {
  const roles = ['admin']
  const inviteCode = 'test-code-getActiveStatuses-2'
  const users = await factory.createMany('user', {roles, inviteCode}, 3)
  const ids = users.map(_ => _.id)
  const result = await runQuery(query, fields, {ids}, {/* no currentUser */})
  const statuses = result.data.getActiveStatuses
  t.is(statuses.length, users.length)
})
