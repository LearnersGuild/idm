/* eslint-disable no-use-extend-native/no-use-extend-native */
import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {connect} from 'src/db'
import {extractUserAvatarUrl, extractUserProfileUrl} from 'src/server/util'
import {errors} from 'src/server/graphql/util'

import {User, ActiveStatus} from './schema'

const {notAuthorized, notFound} = errors

const r = connect()
const table = r.table('users')

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw notAuthorized()
      }

      const user = await table.get(args.id)
      if (!user) {
        throw notFound('User')
      }

      return applyUserProfileUrls(user)
    }
  },
  getUsersByIds: {
    type: new GraphQLList(User),
    args: {
      ids: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))},
    },
    async resolve(source, {ids}, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw notAuthorized()
      }

      const users = await table.getAll(...ids)
      return users.map(applyUserProfileUrls)
    }
  },
  getUsersByHandles: {
    type: new GraphQLList(User),
    args: {
      handles: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    },
    async resolve(source, {handles}, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw notAuthorized()
      }

      const users = await table.getAll(...handles, {index: 'handle'})
      return users.map(applyUserProfileUrls)
    }
  },
  getUser: {
    type: User,
    args: {
      identifier: {type: new GraphQLNonNull(GraphQLString)},
    },
    async resolve(source, {identifier}, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw notAuthorized()
      }

      const users = await table.filter(row => r.or(
        row('id').eq(identifier),
        row('handle').eq(identifier)
      ))

      const user = users[0]
      if (!user) {
        throw notFound('User')
      }

      return applyUserProfileUrls(user)
    }
  },
  findUsers: {
    type: new GraphQLList(User),
    args: {
      identifiers: {type: new GraphQLList(GraphQLString)},
    },
    async resolve(source, args, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw notAuthorized()
      }

      const {identifiers} = args || {}

      const users = await (
        !Array.isArray(identifiers) ?
          table.run() :
          table
            .getAll(...identifiers)
            .union(
              r.table('users')
                .getAll(...identifiers, {index: 'handle'})
            )
            .distinct()
            .run()
      )

      return users.map(applyUserProfileUrls)
    }
  },
  getActiveStatuses: {
    type: new GraphQLList(ActiveStatus),
    args: {
      ids: {type: new GraphQLNonNull(new GraphQLList(GraphQLID))},
    },
    async resolve(source, {ids}) {
      // intentionally a public API not requiring authentication
      // used by marketing reports for our public-facing web site
      if (ids.length > 0) {
        const idsAndActiveStatuses = await table
          .getAll(...ids)
          .pluck('id', 'active')

        return idsAndActiveStatuses
      }

      return []
    }
  },
}

// FIXME: this is a bit janky
function applyUserProfileUrls(user) {
  return user ? {
    ...user,
    profileUrl: extractUserProfileUrl(user),
    avatarUrl: extractUserAvatarUrl(user),
  } : user
}
