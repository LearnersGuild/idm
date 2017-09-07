import test from 'ava'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'
import {runQuery} from 'src/test/graphql'

const r = connect()

import api from '../query'

test.before(async () => {
  await resetData()
})

test.after(async () => {
  await cleanupDB()
})

test('getInviteCodeByCode: returns the correct invite code', async t => {
  t.plan(2)

  const activeInviteCode = await factory.build('inviteCode', {active: true})
  await r.table('inviteCodes').insert(activeInviteCode)

  const query = 'query($code: String!) { getInviteCodeByCode(code: $code) { id code active } }'
  const {data: {getInviteCodeByCode: savedInviteCode}} = await runQuery(query, api, {code: activeInviteCode.code})

  t.is(activeInviteCode.code, savedInviteCode.code)
  t.is(savedInviteCode.active, true)
})

test('getInviteCodeByCode: returns only active invite codes', async t => {
  t.plan(1)

  const inactiveInviteCode = await factory.build('inviteCode', {active: false})
  await r.table('inviteCodes').insert(inactiveInviteCode)

  const query = 'query($code: String!) { getInviteCodeByCode(code: $code) { id code active } }'

  const result = runQuery(query, api, {code: inactiveInviteCode.code})
  return t.throws(result)
})
