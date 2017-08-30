import {connect} from 'src/db'

const r = connect()

export default async function reactivateUser(id) {
  const getUser = r.table('users').get(id)
  await getUser.update({active: true, updatedAt: r.now()}).run()
  return await getUser.run()
}
