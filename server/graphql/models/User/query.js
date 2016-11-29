import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'

import {connect} from 'src/db'
import {extractUserAvatarUrl, extractUserProfileUrl} from 'src/server/util'
import {errors} from 'src/server/graphql/util'

import {User} from './schema'

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
      if (!identifiers) {
        const users = await table.run()
        return users.map(applyUserProfileUrls)
      }

      const [usersByIds, usersByHandles] = await Promise.all([
        table.getAll(...identifiers),
        table.getAll(...identifiers, {index: 'handle'}),
      ])

      return usersByIds.concat(usersByHandles).map(applyUserProfileUrls)
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
