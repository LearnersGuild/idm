import r from 'rethinkdb'
import raven from 'raven'

import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {GraphQLEmailType, GraphQLDateType, GraphQLURLType} from '../types'
import {User, socialURLAttrs} from './schema'

import dbConfig from '../../../../db/config'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

const SocialURLsType = new GraphQLInputObjectType({
  name: 'InputSocialURLs',
  fields: () => socialURLAttrs,
})

export default {
  createUser: {
    type: User,
    args: {
      email: {type: new GraphQLNonNull(GraphQLEmailType)},
      name: {type: new GraphQLNonNull(GraphQLString)},
      dateOfBirth: {type: new GraphQLNonNull(GraphQLDateType)},
      socialURLs: {type: SocialURLsType},
    },
    async resolve(source, {email, name, dateOfBirth, socialURLs}) {
      try {
        const config = dbConfig()
        const conn = await r.connect(config)
        const cursor = await r.table('users').getAll(email, {index: 'email'}).limit(1).run(conn)
        const users = await cursor.toArray()
        const user = users[0]
        // console.log('user:', user)
        if (user) {
          throw new GraphQLError('User already exists')
        } else {
          const userDoc = {
            email,
            name,
            dateOfBirth,
            socialURLs,
            createdAt: r.now(),
            updatedAt: r.now(),
          }
          let newUser = await r.table('users').insert(userDoc, {returnChanges: true}).run(conn)
          if (!newUser.inserted) {
            throw new Error('Could not create user, please try again')
          }
          newUser = newUser.changes[0].new_val
          // console.log('newUser:', newUser)
          return newUser
        }
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  },
}
