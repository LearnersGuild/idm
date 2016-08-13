import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLError} from 'graphql/error'

import db from 'src/db'

import {InviteCode} from './schema'

const r = db.connect()

export default {
  getInviteCodeByCode: {
    type: InviteCode,
    args: {
      code: {type: new GraphQLNonNull(GraphQLString)}
    },
    async resolve(source, args/* , {rootValue: {currentUser}} */) { // no authorization needed -- invite code queries are public
      try {
        const inviteCodes = await r.table('inviteCodes').getAll(args.code, {index: 'code'}).limit(1).run()
        const result = inviteCodes[0]
        if (result) {
          return result
        }
        throw new GraphQLError('No such invite code')
      } catch (err) {
        throw err
      }
    }
  },
}
