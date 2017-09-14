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
    if (!userCan(currentUser, 'updateUser') && user.id !== currentUser.id) {
      throw new GraphQLError('You are not authorized to do that.')
    }

    try {
      return UserModel
        .get(user.id)
        .updateWithTimestamp(user)
    } catch (error) {
      throw new GraphQLError('Could not update user, please try again')
    }
  },
}
