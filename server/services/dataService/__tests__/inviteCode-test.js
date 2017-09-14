import test from 'ava'

import factory from 'src/test/factories'
import {InviteCode} from 'src/server/services/dataService'

test('InviteCode.upsert(id): creates a new invite code', async t => {
  const factoryInviteCode = await factory.build('inviteCode')
  const inviteCode = await InviteCode.upsert(factoryInviteCode)

  t.plan(1)
  t.is(inviteCode.id, factoryInviteCode.id)
})

test('inviteCode.get(id): gets invite code', async t => {
  const factoryInviteCode = await factory.build('inviteCode')
  await InviteCode.upsert(factoryInviteCode)
  const inviteCode = await InviteCode.get(factoryInviteCode.id)

  t.plan(1)
  t.is(inviteCode.id, factoryInviteCode.id)
})
