/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {ActiveStatus} from 'src/server/graphql/schemas'

import {User as UserModel} from 'src/server/services/dataService'

export default {
  type: new GraphQLList(ActiveStatus),
  args: {
    ids: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))},
  },
  async resolve(source, {ids}) {
    // intentionally a public API not requiring authentication
    // used by marketing reports for our public-facing web site
    if (ids.length > 0) {
      return UserModel
        .getAll(...ids)
        .pluck('id', 'active')
        .run()
    }

    return []
  }
}
