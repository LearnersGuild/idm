/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLID} from 'graphql'

import {User} from 'src/server/graphql/schemas'
import {errors, applyUserProfileUrls} from 'src/server/graphql/util'

import {User as UserModel} from 'src/server/services/dataService'

const {notAuthorized, notFound} = errors

export default {
  type: User,
  args: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw notAuthorized()
    }

    try {
      const user = await UserModel.get(args.id)
      return applyUserProfileUrls(user)
    } catch (error) {
      throw notFound('User')
    }
  }
}
