import test from 'ava'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'

const r = connect()

import {findInviteCodesToExpire, deactivateInviteCodes} from '../inviteCodes'

let shouldExpireInviteCode
let shouldntExpireInviteCode
let permanentInviteCode
let willExpireInviteCode
test.before(async () => {
  await resetData()

  const users = []
  shouldExpireInviteCode = await factory.build('inviteCode')
  users.push(await factory.build('user', {inviteCode: shouldExpireInviteCode.code, createdAt: _getPreviousDate(15)}))  // 2+ wks ago
  shouldntExpireInviteCode = await factory.build('inviteCode')
  users.push(await factory.build('user', {inviteCode: shouldntExpireInviteCode.code, createdAt: _getPreviousDate(8)})) // 1+ wk ago
  permanentInviteCode = await factory.build('inviteCode', {permanent: true})
  users.push(await factory.build('user', {inviteCode: permanentInviteCode.code, createdAt: _getPreviousDate(22)}))     // 3+ wks ago
  willExpireInviteCode = await factory.build('inviteCode')

  await r.table('inviteCodes').insert([shouldExpireInviteCode, shouldntExpireInviteCode, permanentInviteCode, willExpireInviteCode])
  await r.table('users').insert(users)
})

test.after(async () => {
  await cleanupDB()
})

test('findInviteCodesToExpire: finds only active temporary invite codes older than 2 weeks ago', async t => {
  const [expiringCode] = await findInviteCodesToExpire()

  t.is(expiringCode, shouldExpireInviteCode.code, 'did not find expiring invite codes')
  t.not(expiringCode, shouldntExpireInviteCode.code, 'should not find non-expired invite codes, but did')
})

test('findInviteCodesToExpire: does not find permanent invite codes', async t => {
  const expiringCodes = await findInviteCodesToExpire()

  t.false(expiringCodes.includes(permanentInviteCode.code), 'should not find permanent codes, but did')
})

test('deactivateInviteCodes: sets the active flags to false', async t => {
  await deactivateInviteCodes([willExpireInviteCode.code])

  const savedExpiredCode = await r.table('inviteCodes').getAll(willExpireInviteCode.code, {index: 'code'}).nth(0)
  t.is(savedExpiredCode.active, false, 'should set active flag to false, but did not')
})

function _getPreviousDate(numDaysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - numDaysAgo)
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ))
}
