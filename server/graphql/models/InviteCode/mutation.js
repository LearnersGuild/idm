import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLInputObjectType, GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import db from 'src/db'

import {InviteCode} from './schema'

const r = db.connect()

const InputInviteCode = new GraphQLInputObjectType({
  name: 'InputInviteCode',
  description: 'The invite code',
  fields: () => ({
    code: {type: new GraphQLNonNull(GraphQLString), description: 'The invite code'},
    description: {type: new GraphQLNonNull(GraphQLString), description: 'The description of for whom the code was created'},
    roles: {type: new GraphQLList(GraphQLString), description: 'The roles to assign to users who sign-up with this invite code'},
  })
})

export default {
  createInviteCode: {
    type: InviteCode,
    args: {
      inviteCode: {type: new GraphQLNonNull(InputInviteCode)},
    },
    async resolve(source, {inviteCode}, {rootValue: {currentUser}}) {
      try {
        const currentUserIsBackOffice = (currentUser && currentUser.roles && currentUser.roles.indexOf('backoffice') >= 0)
        if (!currentUserIsBackOffice) {
          throw new GraphQLError('You are not authorized to do that')
        }

        const inviteCodes = await r.table('inviteCodes').getAll(inviteCode.code, {index: 'code'}).limit(1).run()
        const result = inviteCodes[0]
        if (result) {
          throw new GraphQLError('Invite codes must be unique')
        }

        const inviteCodeWithTimestamps = Object.assign(inviteCode, {createdAt: r.now(), updatedAt: r.now()})
        const insertedInviteCode = await r.table('inviteCodes')
          .insert(inviteCodeWithTimestamps, {returnChanges: 'always'})
          .run()

        if (insertedInviteCode.inserted) {
          return insertedInviteCode.changes[0].new_val
        }

        throw new GraphQLError('Could not create invite code, please try again')
      } catch (err) {
        throw err
      }
    }
  },
}
