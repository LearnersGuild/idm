import url from 'url'

import {GraphQLScalarType} from 'graphql'
import {GraphQLError} from 'graphql/error'
import {Kind} from 'graphql/language'

export const GraphQLEmailType = new GraphQLScalarType({
  name: 'Email',
  serialize: value => value.toLowerCase(),
  parseValue: value => value.toLowerCase(),
  parseLiteral: ast => {
    const re = /.+@.+\.+/
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Email is not a string, it is a: ${ast.kind}`, [ast])
    }
    if (!re.test(ast.value)) {
      throw new GraphQLError('Not a valid Email', [ast])
    }
    if (ast.value.length < 4) {
      throw new GraphQLError(`Email must have a minimum length of 4.`, [ast])
    }
    if (ast.value.length > 300) {
      throw new GraphQLError(`Email is too long.`, [ast])
    }
    return ast.value.toLowerCase()
  },
})

function parseDateFromString(str) {
  try {
    return new Date(str)
  } catch (err) {
    throw new GraphQLError('Cannot parse date from non-ISO8601 string.')
  }
}

export const GraphQLDateType = new GraphQLScalarType({
  name: 'Date',
  serialize: value => value.toISOString(),
  parseValue: value => parseDateFromString(value),
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return parseDateFromString(ast.value)
      case Kind.INT:
        // boundary-check: from the year 0 A.D. too 5000 A.D.
        if (ast.value >= -62167219200000 && ast.value <= 95617584000000) {
          return new Date(ast.value)
        }
        throw new GraphQLError('Invalid date timestamp (< 0 A.D or > 5,000 A.D.).')
      case Kind.OBJECT:
        if (ast.value instanceof Date) {
          return ast.value
        }
        throw new GraphQLError('Cannot parse date from non-date object.')
      default:
        throw new GraphQLError(`Date must be a string, int, or date, but is a: ${ast.kind}`, [ast])
    }
  },
})

function parsePhoneNumber(str) {
  const phoneDigits = str.toString().replace(/\D/g, '')
  if (phoneDigits.length !== 10) {
    throw new GraphQLError('Phone numbers must be 10 digits.')
  }
  return parseInt(phoneDigits, 10)
}

export const GraphQLPhoneNumberType = new GraphQLScalarType({
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

function parseURLFromString(str) {
  try {
    return url.parse(str, true)
  } catch (err) {
    throw new GraphQLError('Could not parse url.')
  }
}

export const GraphQLURLType = new GraphQLScalarType({
  name: 'URL',
  serialize: value => parseURLFromString(value).href,
  parseValue: value => parseURLFromString(value).href,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return parseURLFromString(ast.value).href
      case Kind.OBJECT:
        if (typeof ast.value.href === 'undefined') {
          throw new GraphQLError('Cannot parse URL from non-URL object.')
        }
        return ast.value.href
      default:
        throw new GraphQLError(`URL must be a string or quack like a URL, but is a: ${ast.kind}`, [ast])
    }
  },
})
