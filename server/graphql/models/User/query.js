import r from 'rethinkdb'
import raven from 'raven'

import {GraphQLNonNull, GraphQLID} from 'graphql'
import {User} from './schema'

import dbConfig from '../../../../db/config'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args) {
      try {
        const config = dbConfig()
        const conn = await r.connect(config)
        const result = await r.table('users').get(args.id).run(conn)
        if (result) {
          return result
        }
        throw new Error('No such user')
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  },
}
