import test from 'ava'

import {
  formatPartialPhoneNumber,
  stripNonE164Chars,
  phoneNumberAsE164,
} from 'src/common/util/phoneNumber'

test('formatPartialPhoneNumber does not parenthesize area code when # digits < 7', t => {
  t.plan(3)

  let formatted = formatPartialPhoneNumber('415')
  t.is(formatted, '415')
  formatted = formatPartialPhoneNumber('41533')
  t.is(formatted, '415-33')
  formatted = formatPartialPhoneNumber('4153333')
  t.is(formatted, '415-3333')
})

test('formatPartialPhoneNumber parenthesizes area code when # digits > 7', t => {
  t.plan(2)

  let formatted = formatPartialPhoneNumber('41533333')
  t.is(formatted, '(415) 333-33')
  formatted = formatPartialPhoneNumber('4153333333')
  t.is(formatted, '(415) 333-3333')
})

test('formatPartialPhoneNumber renders a hyphen between prefix and suffix when # digits > 3', t => {
  t.plan(2)

  let formatted = formatPartialPhoneNumber('33333')
  t.is(formatted, '333-33')
  formatted = formatPartialPhoneNumber('3333333')
  t.is(formatted, '333-3333')
})

test('stripNonE164Chars allows only pluses and digits', t => {
  t.plan(3)

  t.is(stripNonE164Chars('415-555-1212'), '4155551212')
  t.is(stripNonE164Chars('+1-415-555-1212   '), '+14155551212')
  t.is(stripNonE164Chars('+1 (415) 555-1212'), '+14155551212')
})

test('stripNonE164Chars returns empty string for null or undefined', t => {
  t.plan(2)

  t.is(stripNonE164Chars(null), '')
  t.is(stripNonE164Chars(), '')
})

test('phoneNumberAsE164 returns an e.164 formatted string', t => {
  t.plan(3)

  t.is(phoneNumberAsE164('415-555-1212'), '+14155551212')
  t.is(phoneNumberAsE164('+1-415-555-1212'), '+14155551212')
  t.is(phoneNumberAsE164('+1 (415) 555-1212'), '+14155551212')
})

test('phoneNumberAsE164 throws an error when phone numbers are too short', t => {
  t.plan(1)

  t.throws(() => phoneNumberAsE164('5551212'))
})
