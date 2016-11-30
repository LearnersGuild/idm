import {connect} from 'src/db'
import {runQuery} from './graphql'
import factory from './factories'

const r = connect()

export async function createUsers(inviteCode, roles, count) {
  const users = await factory.buildMany('user', {inviteCode, roles}, count)
  return r.table('users')
    .insert(users, {returnChanges: 'always'})
    .run()
    .then(result => result.changes.map(c => c.new_val))
}

export async function assertQueryError(t, api, errorMsg, query, params, rootQuery) {
  t.plan(2)
  const result = runQuery(query, api, params, rootQuery)
  const error = await t.throws(result)
  t.true(error.message.includes(errorMsg))
}
