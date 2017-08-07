import {GraphQLNonNull, GraphQLString, GraphQLBoolean} from 'graphql'
import {GraphQLInputObjectType, GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {connect} from 'src/db'
import {InviteCode} from './schema'

import {userCan} from 'src/common/util'

const r = connect()

const InputInviteCode = new GraphQLInputObjectType({
  name: 'InputInviteCode',
  description: 'The invite code',
  fields: () => ({
    code: {type: new GraphQLNonNull(GraphQLString), description: 'The invite code'},
    description: {type: new GraphQLNonNull(GraphQLString), description: 'The description of for whom the code was created'},
    roles: {type: new GraphQLList(GraphQLString), description: 'The roles to assign to users who sign-up with this invite code'},
    active: {type: GraphQLBoolean, description: 'Whether or not this invite code is active'},
    permanent: {type: GraphQLBoolean, description: 'Whether or not this invite code should automatically expire'},
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
        if (!userCan(currentUser, 'createInviteCode')) {
          throw new GraphQLError('You are not authorized to do that')
        }

        const inviteCodes = await r.table('inviteCodes').getAll(inviteCode.code, {index: 'code'}).limit(1).run()
        const result = inviteCodes[0]
        if (result) {
          throw new GraphQLError('Invite codes must be unique')
        }

        const active = inviteCode.active !== false
        const permanent = inviteCode.permanent === true
        const inviteCodeWithFlags = {...inviteCode, active, permanent}
        const inviteCodeWithTimestamps = {...inviteCodeWithFlags, createdAt: r.now(), updatedAt: r.now()}
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
