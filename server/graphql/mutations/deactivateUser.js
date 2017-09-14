import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {User} from 'src/server/graphql/schemas'

import deactivateUser from 'src/server/actions/deactivateUser'
import {userCan} from 'src/common/util'

export default {
  type: User,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  async resolve(source, {id}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'deactivateUser')) {
      throw new GraphQLError('You are not authorized to do that.')
    }

    return deactivateUser(id)
  }
}
