import {GraphQLScalarType} from 'graphql'
import {GraphQLError} from 'graphql/error'
import {Kind} from 'graphql/language'

function parsePhoneNumber(str) {
  const phoneDigits = str.toString().replace(/\D/g, '')
  if (phoneDigits.length !== 10) {
    throw new GraphQLError('Phone numbers must be 10 digits.')
  }
  return parseInt(phoneDigits, 10)
}

export const GraphQLPhoneNumber = new GraphQLScalarType({
  name: 'PhoneNumber',
  serialize: parsePhoneNumber,
  parseValue: parsePhoneNumber,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.INT:
      case Kind.STRING:
        return parsePhoneNumber(ast.value)
      default:
        throw new GraphQLError(`PhoneNumber must be an integer or a string, but it is a: ${ast.kind}`, [ast])
    }
  },
})
