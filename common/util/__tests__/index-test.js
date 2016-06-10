import test from 'ava'
import {formatPhoneNumber, buildURL} from '../index'

test('formatPhoneNumber does not parenthesize area code when # digits === 3', t => {
  t.plan(1)

  const input = '111'
  const formatted = formatPhoneNumber(input)

  t.is(input, formatted)
})

test('formatPhoneNumber parenthesizes area code when # digits > 3', t => {
  t.plan(1)

  const input = '1111'
  const formatted = formatPhoneNumber(input)

  t.is('(111) 1', formatted)
})

test('formatPhoneNumber renders a hyphen between prefix and suffix # digits > 6', t => {
  t.plan(1)

  const input = '1111111'
  const formatted = formatPhoneNumber(input)

  t.is('(111) 111-1', formatted)
})

test('buildURL properly builds URL w/o query params', t => {
  const baseURL = 'http://www.foo.com'
  const url = buildURL(baseURL)
  t.is(url, baseURL)
})

test('baseURL properly builds URL with query params', t => {
  const baseURL = 'http://www.foo.com'
  const params = {blergh: 'hm', blargh: 'ok'}
  const url = buildURL(baseURL, params)
  t.is(url, `${baseURL}?blergh=hm&blargh=ok`)
})
