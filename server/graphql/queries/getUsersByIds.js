/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {User} from 'src/server/graphql/schemas'

import {errors, applyUserProfileUrls} from 'src/server/graphql/util'
import {User as UserModel} from 'src/server/services/dataService'

const {notAuthorized} = errors

export default {
  type: new GraphQLList(User),
  args: {
    ids: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))},
  },
  async resolve(source, {ids}, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw notAuthorized()
    }

    const users = await UserModel.getAll(...ids)
    return users.map(applyUserProfileUrls)
  }
}
