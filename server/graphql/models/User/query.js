import raven from 'raven'

import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types'

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
        const currentUserIsBackOffice = (currentUser && currentUser.roles && currentUser.roles.indexOf('backoffice') >= 0)
        if (!currentUser || (args.id !== currentUser.id && !currentUserIsBackOffice)) {
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
  getUserByEmail: {
    type: User,
    args: {
      email: {type: new GraphQLNonNull(GraphQLEmail)}
    },
    async resolve(source, args/* , {rootValue: {currentUser}} */) {
      try {
        const users = await r.table('users').getAll(args.email, {index: 'email'}).limit(1).run()
        const result = users[0]
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
  getUsersCreatedSince: {
    type: new GraphQLList(User),
    args: {
      since: {type: new GraphQLNonNull(GraphQLDateTime)},
    },
    async resolve(source, {since, secretKey}, {rootValue: {currentUser}}) {
      try {
        // this endpoint is meant for server-to-server communication
        const currentUserIsBackOffice = (currentUser && currentUser.roles && currentUser.roles.indexOf('backoffice') >= 0)
        if (!currentUserIsBackOffice) {
          throw new GraphQLError('You are not authorized to do that.')
        }
        const sinceDate = Date.parse(since)
        return await r.table('users').between(sinceDate, r.maxval, {index: 'createdAt'}).run()
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  }
}
