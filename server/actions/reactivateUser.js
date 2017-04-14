import {connect} from 'src/db'

const r = connect()

export default async function reactivateUser(id) {
  return r.table('users')
    .get(id)
    .update({active: true, updatedAt: r.now()}, {returnChanges: true})
    .run()
}
