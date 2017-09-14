import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {UserAvatar as UserAvatarModel} from 'src/server/services/dataService'
import {userCan} from 'src/common/util'

export default {
  type: GraphQLString,
  args: {
    base64ImgData: {type: new GraphQLNonNull(GraphQLString)},
  },
  async resolve(source, {base64ImgData}, {rootValue: {currentUser}}) {
    if (!userCan(currentUser, 'updateUser')) {
      throw new GraphQLError('You are not authorized to do that.')
    }

    const {id: currentUserId} = currentUser
    await UserAvatarModel.upsert({
      id: currentUserId,
      jpegData: new Buffer(base64ImgData, 'base64')
    })
    return currentUserId
  },
}
