import r from 'rethinkdb'
import raven from 'raven'

import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {GraphQLEmailType} from '../types'
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
        const config = dbConfig()
        const conn = await r.connect(config)
        const result = await r.table('users').get(args.auth0Id).run(conn)
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
        const config = dbConfig()
        const conn = await r.connect(config)
        const result = await r.table('users').get(args.email).run(conn)
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
