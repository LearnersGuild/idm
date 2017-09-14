/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {User} from 'src/server/graphql/schemas'
import {errors, applyUserProfileUrls} from 'src/server/graphql/util'

import {User as UserModel} from 'src/server/services/dataService'
import {downcaseTrimTo21Chars} from 'src/common/util'

const {notAuthorized} = errors

export default {
  type: new GraphQLList(User),
  args: {
    handles: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
  },
  async resolve(source, {handles}, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw notAuthorized()
    }

    const queryHandles = handles.map(downcaseTrimTo21Chars)
    const users = await UserModel.getAll(...queryHandles, {index: 'handle'})
    return users.map(applyUserProfileUrls)
  }
}
