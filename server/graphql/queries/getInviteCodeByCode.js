import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {InviteCode} from 'src/server/graphql/schemas'

import {InviteCode as InviteCodeModel} from 'src/server/services/dataService'

export default {
  type: InviteCode,
  args: {
    code: {type: new GraphQLNonNull(GraphQLString)}
  },
  async resolve(source, {code}) {
    // no authorization needed -- invite code queries are public
    const inviteCode = (await InviteCodeModel
      .getAll(code, {index: 'code'})
      .filter({active: true})
      .limit(1))[0]

    if (!inviteCode) {
      throw new GraphQLError(`No active invite code ${code}`)
    }

    return inviteCode
  }
}
