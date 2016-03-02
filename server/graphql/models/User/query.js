import raven from 'raven'

import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {GraphQLEmailType} from '../types'
import {User} from './schema'

import r from '../../../../db/connect'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args) {
      try {
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
  getUserByAuth0Id: {
    type: User,
    args: {
      auth0Id: {type: new GraphQLNonNull(GraphQLString)}
    },
    async resolve(source, args) {
      try {
        const users = await r.table('users').getAll(args.auth0Id, {index: 'auth0Id'}).limit(1).run()
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
  getUserByEmail: {
    type: User,
    args: {
      email: {type: new GraphQLNonNull(GraphQLEmailType)}
    },
    async resolve(source, args) {
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
}
