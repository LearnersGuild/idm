import test from 'ava'

import factory from 'src/test/factories'
import {resetData, cleanupDB} from 'src/test/db'
import {createUsers} from 'src/test/helpers'
import {User} from 'src/server/services/dataService'

const inviteCode = 'test-invite-code'
const roles = ['admin']

let testUsers
test.before(async () => {
  await resetData()
  testUsers = await createUsers(inviteCode, roles, 3)
})

test.after(async () => {
  await cleanupDB()
})

test('User.get(id): gets correct user from database', async t => {
  const testUser = testUsers[0]
  const user = await User.get(testUser.id)
  console.log(user)
  t.plan(3)
  t.is(user.id, testUser.id)
  t.is(user.inviteCode, inviteCode)
  t.deepEqual(user.roles, roles)
})

test('model.updateWithTimestamp: updates with timestamp', async t => {
  const testUser = testUsers[1]
  const newName = 'New Name'
  await User.get(testUser.id).updateWithTimestamp({name: newName})
  const user = await User.get(testUser.id)

  t.plan(2)
  t.is(user.name, newName)
  t.not(user.updatedAt, testUser.updatedAt)
})

test('model.upsert: updates model', async t => {
  const testUser = testUsers[2]
  const newName = 'Cheesy Cake'
  await User.upsert({...testUser, name: newName})
  const user = await User.get(testUser.id)

  t.plan(2)
  t.is(user.name, newName)
  t.is(user.inviteCode, testUser.inviteCode)
})

test('model.upsert: creates a new entry', async t => {
  const factoryUser = await factory.build('user')
  const user = await User.upsert(factoryUser)

  t.plan(1)
  t.is(user.id, factoryUser.id)
})
