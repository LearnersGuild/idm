import {GraphQLNonNull, GraphQLString, GraphQLBoolean} from 'graphql'
import {GraphQLInputObjectType, GraphQLList} from 'graphql/type'
import {GraphQLError} from 'graphql/error'

import {InviteCode as InviteCodeModel} from 'src/server/services/dataService'
import {InviteCode} from './schema'

import {userCan} from 'src/common/util'

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
      if (!userCan(currentUser, 'createInviteCode')) {
        throw new GraphQLError('You are not authorized to do that')
      }

      const existingInviteCode = (await InviteCodeModel
        .getAll(inviteCode.code, {index: 'code'})
        .limit(1)
        .run())[0]
      if (existingInviteCode) {
        throw new GraphQLError('Invite codes must be unique')
      }

      const active = inviteCode.active !== false
      const permanent = inviteCode.permanent === true
      const inviteCodeWithFlags = {...inviteCode, active, permanent}

      try {
        return InviteCodeModel.save(inviteCodeWithFlags)
      } catch (err) {
        throw new GraphQLError('Could not save invite code, please try again')
      }
    }
  },
}
