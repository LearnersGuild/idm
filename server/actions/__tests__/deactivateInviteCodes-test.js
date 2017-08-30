import test from 'ava'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'

import deactivateInviteCodes from '../deactivateInviteCodes'

const r = connect()

const EXPIRED_CODE = 'expiredcode'

test.before(async () => {
  await resetData()
  await factory.create('inviteCode', {code: EXPIRED_CODE})
})

test.after(async () => {
  await cleanupDB()
})

test('sets the active flags to false', async t => {
  await deactivateInviteCodes([EXPIRED_CODE])
  const savedExpiredCode = await r.table('inviteCodes').getAll(EXPIRED_CODE, {index: 'code'}).nth(0).default(null)
  t.ok(savedExpiredCode, 'should find expired code, but did not')
  t.is(savedExpiredCode.active, false, 'should set active flag to false, but did not')
})
