import raven from 'raven'

import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {User} from './schema'
import {GraphQLEmailType, GraphQLDateType, GraphQLPhoneNumberType} from '../types'

import r from '../../../../db/connect'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

const InputUser = new GraphQLInputObjectType({
  name: 'InputUser',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmailType), description: 'The user email'},
    handle: {type: new GraphQLNonNull(GraphQLString), description: 'The user handle'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    phone: {type: GraphQLPhoneNumberType, description: 'The user phone number'},
    dateOfBirth: {type: GraphQLDateType, description: "The user's date of birth"},
    timezone: {type: GraphQLString, description: 'The user phone number'},
  })
})

export default {
  updateUser: {
    type: User,
    args: {
      user: {type: new GraphQLNonNull(InputUser)},
    },
    async resolve(source, {user}) {
      try {
        const updatedUser = await r.table('users')
          .get(user.id)
          .update(user, {returnChanges: 'always'})
          .run()
        if (updatedUser.replaced) {
          return updatedUser.changes[0].new_val
        } else if (updatedUser.unchanged) {
          return updatedUser.changes[0].old_val
        }
        throw new GraphQLError('Could not update user, please try again')
      } catch (err) {
        sentry.captureException(err)
        throw err
      }
    }
  },
}
