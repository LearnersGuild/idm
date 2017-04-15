import {connect} from 'src/db'

const r = connect()

export default async function deactivateUser(id) {
  const getUser = r.table('users').get(id)
  await getUser.update({active: false, updatedAt: r.now()}).run()
  return await getUser.run()
}
