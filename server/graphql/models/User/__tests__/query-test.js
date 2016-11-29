import test from 'ava'

import {resetData} from 'src/test/db'
import {runQuery} from 'src/test/graphql'
import {createUsers} from 'src/test/helpers'

import api from '../query'

const fields = 'id name handle active email phone profileUrl avatarUrl roles inviteCode createdAt updatedAt'
const queries = {
  getUserById: `query($id: ID!) { getUserById(id: $id) { ${fields} } }`,
  getUsersByIds: `query($ids: [ID]!) { getUsersByIds(ids: $ids) { ${fields} } }`,
  getUsersByHandles: `query($handles: [String]!) { getUsersByHandles(handles: $handles) { ${fields} } }`,
  getUser: `query($identifier: String!) { getUser(identifier: $identifier) { ${fields} } }`,
  findUsers: `query($identifiers: [String]) { findUsers(identifiers: $identifiers) { ${fields} } }`,
}

const ERROR_MSG_MISSING_PARAM = 'not provided'
const ERROR_MSG_NOT_FOUND = 'not found'
const ERROR_MSG_NOT_AUTH = 'not authorized'

const TEST_USER_COUNT = 5
const TEST_USER_INVITE_CODE = 'test-invite-code'
const TEST_USER_ROLES = ['moderator']

let testUsers
test.before(async () => {
  await resetData()
  testUsers = await createUsers(TEST_USER_INVITE_CODE, TEST_USER_ROLES, TEST_USER_COUNT)
})

test('getUserById: returns correct user for valid id', async t => {
  t.plan(3)
  const [testUser] = testUsers
  const results = await runQuery(queries.getUserById, api, {id: testUser.id})
  t.is(results.data.getUserById.id, testUser.id)
  t.is(results.data.getUserById.inviteCode, TEST_USER_INVITE_CODE)
  t.deepEqual(results.data.getUserById.roles, TEST_USER_ROLES)
})

test('getUserById: throws an error if id is missing', async t => {
  t.plan(2)
  const query = runQuery(queries.getUserById, api)
  const error = await t.throws(query)
  console.log('error.message:', error.message)
  t.true(error.message.includes(ERROR_MSG_MISSING_PARAM))
})

test('getUserById: throws an error if id is not matched', async t => {
  t.plan(2)
  const query = runQuery(queries.getUserById, api, {id: 'fake.id'})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_FOUND))
})

test('getUserById: throws an error if user is not signed-in', async t => {
  t.plan(2)
  const query = runQuery(queries.getUserById, api, {id: 'fake.id'}, {currentUser: null})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_AUTH))
})

test('getUsersByIds: returns array of correct users for array of valid ids', async t => {
  t.plan(1 + testUsers.length)
  const ids = testUsers.map(u => u.id)
  const results = await runQuery(queries.getUsersByIds, api, {ids})
  t.is(results.data.getUsersByIds.length, testUsers.length)
  testUsers.forEach(testUser => {
    t.truthy(results.data.getUsersByIds.find(u => u.id === testUser.id))
  })
})

test('getUsersByIds: returns empty array for empty array of ids', async t => {
  t.plan(1)
  const results = await runQuery(queries.getUsersByIds, api, {ids: []})
  t.is(results.data.getUsersByIds.length, 0)
})

test('getUsersByIds: throws an error if ids is missing', async t => {
  t.plan(2)
  const query = runQuery(queries.getUsersByIds, api)
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_MISSING_PARAM))
})

test('getUsersByIds: throws an error if user is not signed-in', async t => {
  t.plan(2)
  const query = runQuery(queries.getUsersByIds, api, {ids: ['fake.id']}, {currentUser: null})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_AUTH))
})

test('getUsersByHandles: returns array of correct users for array of valid handles', async t => {
  t.plan(1 + testUsers.length)
  const handles = testUsers.map(u => u.handle)
  const results = await runQuery(queries.getUsersByHandles, api, {handles})
  t.is(results.data.getUsersByHandles.length, testUsers.length)
  testUsers.forEach(testUser => {
    t.truthy(results.data.getUsersByHandles.find(u => u.handle === testUser.handle))
  })
})

test('getUsersByHandles: returns empty array for empty array of handles', async t => {
  t.plan(1)
  const results = await runQuery(queries.getUsersByHandles, api, {handles: []})
  t.is(results.data.getUsersByHandles.length, 0)
})

test('getUsersByHandles: throws an error if handles is missing', async t => {
  t.plan(2)
  const query = runQuery(queries.getUsersByHandles, api)
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_MISSING_PARAM))
})

test('getUsersByHandles: throws an error if user is not signed-in', async t => {
  t.plan(2)
  const query = runQuery(queries.getUsersByHandles, api, {handles: ['fake.handle']}, {currentUser: null})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_AUTH))
})

test('getUser: returns correct user for valid identifier', async t => {
  t.plan(1)
  const [testUser] = testUsers
  const results = await runQuery(queries.getUser, api, {identifier: testUser.id})
  t.is(results.data.getUser.id, testUser.id)
})

test('getUser: returns correct user for valid handle', async t => {
  t.plan(1)
  const [testUser] = testUsers
  const results = await runQuery(queries.getUser, api, {identifier: testUser.handle})
  t.is(results.data.getUser.id, testUser.id)
})

test('getUser: throws an error if identifier is missing', async t => {
  t.plan(2)
  const query = runQuery(queries.getUser, api)
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_MISSING_PARAM))
})

test('getUser: throws an error if identifier is not matched', async t => {
  t.plan(2)
  const query = runQuery(queries.getUser, api, {identifier: 'fake.id'})
  const error = await t.throws(query)
  t.true(error.message.includes('not found'))
})

test('getUser: throws an error if user is not signed-in', async t => {
  t.plan(2)
  const query = runQuery(queries.getUser, api, {identifier: ''}, {currentUser: null})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_AUTH))
})

test('findUsers: returns correct user for combination of ids and handles', async t => {
  t.plan(4)
  const [testUser1, testUser2, testUser3] = testUsers
  const identifiers = [testUser1.id, testUser2.handle, testUser3.id]
  const results = await runQuery(queries.findUsers, api, {identifiers})
  t.is(results.data.findUsers.length, 3)
  t.truthy(results.data.findUsers.find(u => u.id === testUser1.id))
  t.truthy(results.data.findUsers.find(u => u.handle === testUser2.handle))
  t.truthy(results.data.findUsers.find(u => u.id === testUser3.id))
})

test('findUsers: returns all users if identifiers missing', async t => {
  t.plan(1)
  const results = await runQuery(queries.findUsers, api)
  t.is(results.data.findUsers.length, testUsers.length)
})

test('findUsers: returns empty array of users for empty array of identifiers', async t => {
  t.plan(1)
  const results = await runQuery(queries.findUsers, api, {identifiers: []})
  t.is(results.data.findUsers.length, 0)
})

test('findUsers: throws an error if user is not signed-in', async t => {
  t.plan(2)
  const query = runQuery(queries.findUsers, api, null, {currentUser: null})
  const error = await t.throws(query)
  t.true(error.message.includes(ERROR_MSG_NOT_AUTH))
})
