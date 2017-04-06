import {GraphQLObjectType} from 'graphql'
import {instrumentResolvers} from './util'

import user from './models/User/mutation'
import inviteCode from './models/InviteCode/mutation'

const rootFields = Object.assign(user, inviteCode)

export default new GraphQLObjectType({
  name: 'RootMutation',
  fields: instrumentResolvers(rootFields, 'mutation'),
})
