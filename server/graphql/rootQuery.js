import {GraphQLObjectType} from 'graphql'

import user from './models/User/query'
import inviteCode from './models/InviteCode/query'

const rootFields = Object.assign(user, inviteCode)

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
})
