/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLString} from 'graphql'

import {User} from 'src/server/graphql/schemas'
import {errors, applyUserProfileUrls} from 'src/server/graphql/util'

import {downcaseTrimTo21Chars} from 'src/common/util'
import {User as UserModel} from 'src/server/services/dataService'
import {connect} from 'src/db'

const r = connect()

const {notAuthorized, notFound} = errors

export default {
  type: User,
  args: {
    identifier: {type: new GraphQLNonNull(GraphQLString)},
  },
  async resolve(source, {identifier}, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw notAuthorized()
    }

    const [user] = await UserModel.filter(row => r.or(
      row('id').eq(identifier),
      row('handle').downcase().slice(0, 21).eq(downcaseTrimTo21Chars(identifier))
    ))

    if (!user) {
      throw notFound('User')
    }

    return applyUserProfileUrls(user)
  }
}
