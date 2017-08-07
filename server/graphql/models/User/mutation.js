import {GraphQLNonNull, GraphQLString, GraphQLID} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'
import {GraphQLError} from 'graphql/error'
import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types'

import {GraphQLPhoneNumber} from 'src/server/graphql/models/types'
import {connect} from 'src/db'

import {User} from './schema'

import deactivateUser from 'src/server/actions/deactivateUser'

import {userCan} from 'src/common/util'

const r = connect()

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
  deactivateUser: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)},
    },
    async resolve(source, {id}, {rootValue: {currentUser}}) {
      if (!userCan(currentUser, 'deactivateUser')) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      return await deactivateUser(id)
    }
  },
  updateUser: {
    type: User,
    args: {
      user: {type: new GraphQLNonNull(InputUser)},
    },
    async resolve(source, {user}, {rootValue: {currentUser}}) {
      if (!userCan(currentUser, 'updateUser') && user.id !== currentUser.id) {
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
    },
  },
  updateUserAvatar: {
    type: GraphQLString,
    args: {
      base64ImgData: {type: new GraphQLNonNull(GraphQLString)},
    },
    async resolve(source, {base64ImgData}, {rootValue: {currentUser}}) {
      const jpegData = new Buffer(base64ImgData, 'base64')
      await r.table('userAvatars')
        .get(currentUser.id)
        .replace(userAvatar => {
          return r.branch(
            userAvatar.eq(null),
            {id: currentUser.id, jpegData, createdAt: r.now(), updatedAt: r.now()},
            userAvatar.merge({jpegData, updatedAt: r.now()})
          )
        })
      return currentUser.id
    },
  }
}
