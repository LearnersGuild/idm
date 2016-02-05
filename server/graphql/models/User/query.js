import r from 'rethinkdb'

import {GraphQLString, GraphQLNonNull, GraphQLID} from 'graphql'
import {GraphQLEmailType} from '../types'
import {User} from './schema'

import dbConfig from '../../../../db/config'

export default {
  getUserById: {
    type: User,
    args: {
      id: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve(source, args, {rootValue}) {
      return new Promise((resolve, reject) => {
        const config = dbConfig()
        r.connect(config)
          .then(conn => {
            r.table('users')
              .get(args.id).run(conn)
              .then(result => {
                if (result) {
                  return resolve(result)
                }
                return reject('No such user')
              })
        }).catch(err => {
          throw new Error(err)
        })
      })
    }
  },
}
