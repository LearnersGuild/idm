import {GraphQLScalarType} from 'graphql'
import {GraphQLError} from 'graphql/error'
import {Kind} from 'graphql/language'

import {phoneNumberAsE164} from '../../../common/util/phoneNumber'

export const GraphQLPhoneNumber = new GraphQLScalarType({
  name: 'PhoneNumber',
  serialize: phoneNumberAsE164,
  parseValue: phoneNumberAsE164,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return phoneNumberAsE164(ast.value)
      default:
        throw new GraphQLError(`PhoneNumber must be a string, but it is a: ${ast.kind}`, [ast])
    }
  },
})
