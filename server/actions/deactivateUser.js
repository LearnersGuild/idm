import {connect} from 'src/db'

const r = connect()

export default async function deactivateUser(id) {
  return r.table('users')
    .get(id)
    .update({active: false, updatedAt: r.now()}, {returnChanges: 'always'})
    .run()
}
