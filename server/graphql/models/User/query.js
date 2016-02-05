import r from 'rethinkdb'
import raven from 'raven'

import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
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
    resolve(source, args, {rootValue}) {
      return new Promise((resolve, reject) => {
        const config = dbConfig()
        return r.connect(config)
          .then(conn => {
            return r.table('users')
              .get(args.id).run(conn)
              .then(result => {
                if (result) {
                  return resolve(result)
                }
                throw new Error('No such user')
              })
        }).catch(err => {
          sentry.captureException(err)
          return reject(err)
        })
      })
    }
  },
}
