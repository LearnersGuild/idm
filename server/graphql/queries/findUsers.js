/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {User} from 'src/server/graphql/schemas'
import {errors, applyUserProfileUrls} from 'src/server/graphql/util'

import {connect} from 'src/db'
import {User as UserModel} from 'src/server/services/dataService'
import {downcaseTrimTo21Chars} from 'src/common/util'

const r = connect()

const {notAuthorized} = errors

export default {
  type: new GraphQLList(User),
  args: {
    identifiers: {type: new GraphQLList(GraphQLString)},
  },
  async resolve(source, args, {rootValue: {currentUser}}) {
    if (!currentUser) {
      throw notAuthorized()
    }

    const {identifiers} = args || {}
    const queryHandles = identifiers ?
      identifiers.map(downcaseTrimTo21Chars) : undefined

    let users
    if (!Array.isArray(identifiers)) {
      users = await UserModel.run()
    } else if (identifiers.length === 0) {
      users = []
    } else {
      users = await UserModel
        .getAll(...identifiers)
        .union(
          r.table('users')
            .getAll(...queryHandles, {index: 'handle'})
        )
        .distinct()
        .run()
    }

    return users.map(applyUserProfileUrls)
  }
}
