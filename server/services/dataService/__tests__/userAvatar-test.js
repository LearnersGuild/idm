import test from 'ava'

import factory from 'src/test/factories'
import {resetData, cleanupDB} from 'src/test/db'
import {UserAvatar} from 'src/server/services/dataService'

test.before(async () => {
  await resetData()
})

test.after(async () => {
  await cleanupDB()
})

test('userAvatar.upsert(id): creates a new user avatar', async t => {
  const factoryUserAvatar = await factory.build('userAvatar')
  const userAvatar = await UserAvatar.upsert(factoryUserAvatar)

  t.plan(2)
  t.is(userAvatar.id, factoryUserAvatar.id)
  t.deepEqual(userAvatar.jpegData, factoryUserAvatar.jpegData)
})

test('userAvatar.get(id): gets a user avatar', async t => {
  const factoryUserAvatar = await factory.build('userAvatar')
  await UserAvatar.upsert(factoryUserAvatar)
  const userAvatar = await UserAvatar.get(factoryUserAvatar.id)

  t.plan(2)
  t.is(userAvatar.id, factoryUserAvatar.id)
  t.deepEqual(userAvatar.jpegData, factoryUserAvatar.jpegData)
})
