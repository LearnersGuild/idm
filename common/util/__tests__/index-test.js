import test from 'ava'
import {formatPhoneNumber, buildURL} from '../index'

test('formatPhoneNumber does not parenthesize area code when # digits < 7', t => {
  t.plan(3)

  let formatted = formatPhoneNumber('415')
  t.is(formatted, '415')
  formatted = formatPhoneNumber('41533')
  t.is(formatted, '415-33')
  formatted = formatPhoneNumber('4153333')
  t.is(formatted, '415-3333')
})

test('formatPhoneNumber parenthesizes area code when # digits > 7', t => {
  t.plan(2)

  let formatted = formatPhoneNumber('41533333')
  t.is(formatted, '(415) 333-33')
  formatted = formatPhoneNumber('4153333333')
  t.is(formatted, '(415) 333-3333')
})

test('formatPhoneNumber renders a hyphen between prefix and suffix when # digits > 3', t => {
  t.plan(2)

  let formatted = formatPhoneNumber('33333')
  t.is(formatted, '333-33')
  formatted = formatPhoneNumber('3333333')
  t.is(formatted, '333-3333')
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
