import test from 'ava'

import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'

import findInviteCodesToExpire from '../findInviteCodesToExpire'

const INVITE_CODES = {
  SHOULD_EXPIRE: 'shouldExpire',
  SHOULD_NOT_EXPIRE: 'shouldNotExpire',
  PERMANENT: 'permanent',
}

test.before(async () => {
  await resetData()

  await Promise.all([
    factory.create('inviteCode', {code: INVITE_CODES.SHOULD_EXPIRE}),
    factory.create('inviteCode', {code: INVITE_CODES.SHOULD_NOT_EXPIRE}),
    factory.create('inviteCode', {code: INVITE_CODES.PERMANENT, permanent: true}),
  ])

  await Promise.all([
    factory.create('user', {inviteCode: INVITE_CODES.SHOULD_EXPIRE, createdAt: _getPreviousDate(15)}),    // 2+ wks ago
    factory.create('user', {inviteCode: INVITE_CODES.SHOULD_NOT_EXPIRE, createdAt: _getPreviousDate(8)}), // 1+ wk ago
    factory.create('user', {inviteCode: INVITE_CODES.PERMANENT, createdAt: _getPreviousDate(22)}),        // 3+ wks ago
  ])
})

test.after(async () => {
  await cleanupDB()
})

test('finds only active temporary invite codes older than 2 weeks ago', async t => {
  const expiredCodes = await findInviteCodesToExpire()
  t.true(expiredCodes.includes(INVITE_CODES.SHOULD_EXPIRE), 'should find expiring invite code, but did not')
  t.false(expiredCodes.includes(INVITE_CODES.SHOULD_NOT_EXPIRE), 'should not find codes that have not expired, but did')
  t.false(expiredCodes.includes(INVITE_CODES.PERMANENT), 'should not find permanent codes, but did')
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
