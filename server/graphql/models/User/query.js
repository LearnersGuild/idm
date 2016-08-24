import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import db from 'src/db'
import {extractUserAvatarUrl, extractUserProfileUrl} from 'src/server/util'

import {User} from './schema'

const r = db.connect()

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      let user = await r.table('users').get(args.id).run()

      if (!user) {
        throw new GraphQLError('No such user')
      }

      user = applyUserProfileUrls(user)
      return user
    }
  },
  getUsersByHandles: {
    type: new GraphQLList(User),
    args: {
      handles: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    },
    async resolve(source, {handles}, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      const users = await r.table('users')
        .getAll(...handles, {index: 'handle'})
        .run()

      return users.map(user => applyUserProfileUrls(user))
    }
  },
  getUsersByIds: {
    type: new GraphQLList(User),
    args: {
      ids: {type: new GraphQLList(GraphQLID)},
    },
    async resolve(source, {ids}, {rootValue: {currentUser}}) {
      if (!currentUser) {
        throw new GraphQLError('You are not authorized to do that.')
      }

      const users = await r.table('users')
        .getAll(...ids)
        .run()

      return users.map(user => applyUserProfileUrls(user))
    }
  }
}

 // FIXME: this is a bit janky
function applyUserProfileUrls(user) {
  return user ? {
    ...user,
    profileUrl: extractUserProfileUrl(user),
    avatarUrl: extractUserAvatarUrl(user),
  } : null
}
