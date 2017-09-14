import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {User} from 'src/server/graphql/schemas'

import reactivateUser from 'src/server/actions/reactivateUser'
import {userCan} from 'src/common/util'

export default {
  type: User,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)},
  },
  async resolve(source, {id}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'reactivateUser')) {
      throw new GraphQLError('You are not authorized to reactivate a user.')
    }

    return reactivateUser(id)
  }
}
