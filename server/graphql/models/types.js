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
      throw new GraphQLError('Email is not a string, it is a: ' + ast.kind, [ast])
    }
    if(!re.test(ast.value)) {
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
