import {GraphQLNonNull, GraphQLID, GraphQLString} from 'graphql'
import {GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import db from '../../../../db'

import {User} from './schema'

const r = db.connect()

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    async resolve(source, args, {rootValue: {currentUser}}) {
      try {
        if (!currentUser) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        const result = await r.table('users').get(args.id).run()
        if (result) {
          return result
        }

        throw new GraphQLError('No such user')
      } catch (err) {
        throw err
      }
    }
  },
  getUsersByHandles: {
    type: new GraphQLList(User),
    args: {
      handles: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    },
    async resolve(source, {handles}, {rootValue: {currentUser}}) {
      try {
        if (!currentUser) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        return await r.table('users').getAll(...handles, {index: 'handle'}).run()
      } catch (err) {
        throw err
      }
    }
  },
  getUsersByIds: {
    type: new GraphQLList(User),
    args: {
      ids: {type: new GraphQLList(GraphQLID)},
    },
    async resolve(source, {ids}, {rootValue: {currentUser}}) {
      try {
        if (!currentUser) {
          throw new GraphQLError('You are not authorized to do that.')
        }

        return await r.table('users').getAll(...ids).run()
      } catch (err) {
        throw err
      }
    }
  }
}
