import faker from 'faker'

import factory from './factories'

async function generate() {
  try {
    require('dotenv').load()
    const r = require('../db/connect')

    const NUM_PLAYERS = 60
    const INVITE_CODES = ['test01', 'test02', 'test03']
    const inviteCodeObjs = Array.from(Array(NUM_PLAYERS).keys()).map(() => ({inviteCode: faker.random.arrayElement(INVITE_CODES)}))

    const users = await factory.buildMany('user', inviteCodeObjs, NUM_PLAYERS)
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
