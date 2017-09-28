import {GraphQLNonNull, GraphQLString} from 'graphql'

import {UserAvatar as UserAvatarModel} from 'src/server/services/dataService'

export default {
  type: GraphQLString,
  args: {
    base64ImgData: {type: new GraphQLNonNull(GraphQLString)},
  },
  async resolve(source, {base64ImgData}, {rootValue: {currentUser}}) {
    const {id: currentUserId} = currentUser
    await UserAvatarModel.upsert({
      id: currentUserId,
      jpegData: new Buffer(base64ImgData, 'base64')
    })
    return currentUserId
  },
}
