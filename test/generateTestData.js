import factory from './factories'

async function generate() {
  try {
    require('dotenv').load()
    const r = require('../db/connect')

    const INVITE_CODES = ['test01', 'test02', 'test03']

    const users = await factory.buildMany('user', 10)
    r.table('users')
      .insert(users)
      .run()

    r.getPoolMaster().drain()
  } catch (error) {
    console.error(error.stack)
  }
}

export default generate

if (!module.parent) {
  generate()
}
