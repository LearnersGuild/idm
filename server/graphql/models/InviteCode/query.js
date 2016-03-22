import raven from 'raven'

import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {InviteCode} from './schema'

import r from '../../../../db/connect'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export default {
  getInviteCodeByCode: {
    type: InviteCode,
    args: {
      code: {type: new GraphQLNonNull(GraphQLString)}
    },
    async resolve(source, args) {
      try {
        const inviteCodes = await r.table('inviteCodes').getAll(args.code, {index: 'code'}).limit(1).run()
        const result = inviteCodes[0]
        if (result) {
          return result
        }
        throw new GraphQLError('No such invite code')
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  },
}
