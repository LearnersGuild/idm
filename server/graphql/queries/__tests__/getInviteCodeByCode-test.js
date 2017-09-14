import test from 'ava'

import factory from 'src/test/factories'
import {runQuery} from 'src/test/graphql'

import fields from '../index'

const query = `
  query($code: String!) {
    getInviteCodeByCode(code: $code) {
      id code active
    }
  }
`

test('returns the correct invite code', async t => {
  t.plan(2)

  const activeInviteCode = await factory.create('inviteCode', {active: true})

  const {data: {getInviteCodeByCode: savedInviteCode}} = await runQuery(query, fields, {code: activeInviteCode.code})

  t.is(activeInviteCode.code, savedInviteCode.code)
  t.is(savedInviteCode.active, true)
})

test('returns only active invite codes', async t => {
  t.plan(1)

  const inactiveInviteCode = await factory.create('inviteCode', {active: false})
  const result = runQuery(query, fields, {code: inactiveInviteCode.code})
  return t.throws(result)
})
