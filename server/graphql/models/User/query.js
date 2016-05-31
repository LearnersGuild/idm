import raven from 'raven'

import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {User} from './schema'

import r from '../../../../db/connect'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args, {rootValue: {currentUser}}) {
      try {
        if (!currentUser) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        const result = await r.table('users').get(args.id).run()
        if (result) {
          return result
        }
        throw new GraphQLError('No such user')
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  },
  getUsersByIds: {
    type: new GraphQLList(User),
    args: {
      ids: {type: new GraphQLList(GraphQLID)},
    },
    async resolve(source, {ids}, {rootValue: {currentUser}}) {
      try {
        if (!currentUser) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        return await r.table('users').getAll(...ids).run()
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  }
}
