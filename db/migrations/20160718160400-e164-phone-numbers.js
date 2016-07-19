/* eslint-disable no-var, prefer-arrow-callback */
var PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat
var PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil

exports.up = function (r, conn) {
  return r.table('users').run(conn).then(function (users) {
    const promises = users.map(function (user) {
      return r.table('users').get(user.id).update({phone: phoneNumberToE164(user.phone)}).run(conn)
    })
    return Promise.all(promises)
  })
}

exports.down = function (r, conn) {
  return r.table('users').run(conn).then(function (users) {
    const promises = users.map(function (user) {
      return r.table('users').get(user.id).update({phone: e164ToPhoneNumber(user.phone)}).run(conn)
    })
    return Promise.all(promises)
  })
}

const phoneUtil = PhoneNumberUtil.getInstance()

function phoneNumberToE164(phone) {
  const phoneDigits = stripNonE164Chars(phone)
  if (phoneDigits.length < 10) {
    return null
  }
  const phoneNumber = phoneUtil.parse(phoneDigits, 'US')
  return phoneUtil.format(phoneNumber, PhoneNumberFormat.E164)
}

function e164ToPhoneNumber(e164) {
  const phoneNumber = phoneUtil.parse(e164, 'US')
  const phone = phoneUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL)
  return parseInt(stripNonE164Chars(phone), 10)
}

function stripNonE164Chars(str) {
  if (!str) {
    return ''
  }
  return str.toString().replace(/[^+\d]/g, '')
}
