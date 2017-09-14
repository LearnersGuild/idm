import {GraphQLNonNull} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {InputInviteCode, InviteCode} from 'src/server/graphql/schemas'

import {userCan} from 'src/common/util'
import {InviteCode as InviteCodeModel} from 'src/server/services/dataService'

export default {
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

    try {
      const active = inviteCode.active !== false
      const permanent = inviteCode.permanent === true
      const inviteCodeWithFlags = {...inviteCode, active, permanent}
      return InviteCodeModel.save(inviteCodeWithFlags)
    } catch (err) {
      throw new GraphQLError('Could not create invite code, please try again')
    }
  }
}
