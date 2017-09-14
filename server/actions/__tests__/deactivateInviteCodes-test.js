import test from 'ava'

import {connect} from 'src/db'
import factory from 'src/test/factories'

import deactivateInviteCodes from '../deactivateInviteCodes'

const r = connect()

test('sets the active flags to false', async t => {
  const expiredCode = 'expiredcode'
  await factory.create('inviteCode', {code: expiredCode})

  await deactivateInviteCodes([expiredCode])

  const savedExpiredCode = await r.table('inviteCodes')
    .getAll(expiredCode, {index: 'code'})
    .nth(0)
    .default(null)

  t.truthy(savedExpiredCode, 'should find expired code, but did not')
  t.is(savedExpiredCode.active, false, 'should set active flag to false, but did not')
})
