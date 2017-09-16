import {GraphQLNonNull} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {InputUser, User} from 'src/server/graphql/schemas'

import {User as UserModel} from 'src/server/services/dataService'
import {userCan} from 'src/common/util'

export default {
  type: User,
  args: {
    user: {type: new GraphQLNonNull(InputUser)},
  },
  async resolve(source, {user}, {rootValue: {currentUser}}) {
    if (user.id !== currentUser.id && !userCan(currentUser, 'updateUser')) {
      throw new GraphQLError('You are not authorized to do that.')
    }
    if (user.roles && !userCan(currentUser, 'updateUserRoles')) {
      throw new GraphQLError('You are not authorized to edit user roles')
    }

    try {
      return UserModel
        .get(user.id)
        .updateWithTimestamp(user)
    } catch (err) {
      console.error(err)
      throw new GraphQLError('Could not update user')
    }
  },
}
