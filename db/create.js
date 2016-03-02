/* eslint-disable no-console */
import r from './connect'

import dbConfig from './config'

export async function create(config = dbConfig()) {
  return await r.dbCreate(config.db).run()
}

async function run() {
  try {
    const config = dbConfig()
    await create(config)
    console.log(`Successfully created database '${config.db}'.`)
    process.exit(0)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

if (!module.parent) {
  run()
}
