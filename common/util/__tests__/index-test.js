import test from 'ava'
import {formatPhoneNumber} from '../index'

test('formatPhoneNumber does not parenthesize area code when # digits === 3', t => {
  t.plan(1)

  const input = `111`
  const formatted = formatPhoneNumber(input)

  t.is(input, formatted)
})

test('formatPhoneNumber parenthesizes area code when # digits > 3', t => {
  t.plan(1)

  const input = `1111`
  const formatted = formatPhoneNumber(input)

  t.is('(111) 1', formatted)
})

test('formatPhoneNumber parenthesizes area code when # digits > 6', t => {
  t.plan(1)

  const input = `1111111`
  const formatted = formatPhoneNumber(input)

  t.is('(111) 111-1', formatted)
})
