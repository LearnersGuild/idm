import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLError} from 'graphql/error'
import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types'

import {GraphQLPhoneNumber} from 'src/server/graphql/models/types'
import db from 'src/db'

import {User} from './schema'

const r = db.connect()

const InputUser = new GraphQLInputObjectType({
  name: 'InputUser',
  description: 'The user account',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID), description: 'The user UUID'},
    email: {type: new GraphQLNonNull(GraphQLEmail), description: 'The user email'},
    handle: {type: new GraphQLNonNull(GraphQLString), description: 'The user handle'},
    name: {type: new GraphQLNonNull(GraphQLString), description: 'The user name'},
    phone: {type: GraphQLPhoneNumber, description: 'The user phone number'},
    dateOfBirth: {type: GraphQLDateTime, description: "The user's date of birth"},
    timezone: {type: GraphQLString, description: 'The user timezone'},
  })
})

export default {
  updateUser: {
    type: User,
    args: {
      user: {type: new GraphQLNonNull(InputUser)},
    },
    async resolve(source, {user}, {rootValue: {currentUser}}) {
      try {
        const currentUserIsBackOffice = (currentUser && currentUser.roles && currentUser.roles.indexOf('backoffice') >= 0)
        if (!currentUser || (user.id !== currentUser.id && !currentUserIsBackOffice)) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        const userWithTimestamps = Object.assign(user, {updatedAt: r.now()})
        const updatedUser = await r.table('users')
          .get(user.id)
          .update(userWithTimestamps, {returnChanges: 'always'})
          .run()

        if (updatedUser.replaced) {
          return updatedUser.changes[0].new_val
        } else if (updatedUser.unchanged) {
          return updatedUser.changes[0].old_val
        }

        throw new GraphQLError('Could not update user, please try again')
      } catch (err) {
        throw err
      }
    }
  },
}
