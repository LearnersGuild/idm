import {connect} from 'src/db'
import factory from './factories'

const r = connect()

export async function createUsers(inviteCode, roles, count) {
  const users = await factory.buildMany('user', {inviteCode, roles}, count)
  return r.table('users')
    .insert(users, {returnChanges: 'always'})
    .run()
    .then(result => result.changes.map(c => c.new_val))
}
