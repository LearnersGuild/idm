import {GraphQLNonNull, GraphQLString} from 'graphql'
import {GraphQLError} from 'graphql/error'

import {InviteCode as InviteCodeModel} from 'src/server/services/dataService'
import {InviteCode} from './schema'

export default {
  getInviteCodeByCode: {
    type: InviteCode,
    args: {
      code: {type: new GraphQLNonNull(GraphQLString)}
    },
    async resolve(source, {code}) {
      // no authorization needed -- invite code queries are public
      const inviteCodes = await InviteCodeModel
        .getAll(code, {index: 'code'})
        .filter({active: true})
        .limit(1)
        .run()
      const result = inviteCodes[0]
      if (result) {
        return result
      }
      throw new GraphQLError(`No active invite code named ${code}`)
    }
  },
}
