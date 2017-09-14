import {GraphQLScalarType} from 'graphql'
import {GraphQLError} from 'graphql/error'
import {Kind} from 'graphql/language'

import {phoneNumberAsE164} from 'src/common/util/phoneNumber'

export default new GraphQLScalarType({
  name: 'PhoneNumber',
  serialize: _parsePhoneNumber,
  parseValue: _parsePhoneNumber,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return _parsePhoneNumber(ast.value)
      default:
        throw new GraphQLError(`PhoneNumber must be a string, but it is a: ${ast.kind}`, [ast])
    }
  },
})

function _parsePhoneNumber(str) {
  try {
    return phoneNumberAsE164(str)
  } catch (err) {
    throw new GraphQLError(err.message)
  }
}
