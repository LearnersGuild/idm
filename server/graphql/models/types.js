import {GraphQLScalarType} from 'graphql'
import {GraphQLError} from 'graphql/error'
import {Kind} from 'graphql/language'

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

function parsePhoneNumber(str) {
  const phoneUtil = PhoneNumberUtil.getInstance()
  const phoneDigits = str.toString().replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    throw new GraphQLError('Phone numbers must be at least 10 digits.')
  }
  const phoneNumber = phoneUtil.parse(phoneDigits, 'US')
  return phoneUtil.format(phoneNumber, PhoneNumberFormat.E164)
}

export const GraphQLPhoneNumber = new GraphQLScalarType({
  name: 'PhoneNumber',
  serialize: parsePhoneNumber,
  parseValue: parsePhoneNumber,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return parsePhoneNumber(ast.value)
      default:
        throw new GraphQLError(`PhoneNumber must be a string, but it is a: ${ast.kind}`, [ast])
    }
  },
})
