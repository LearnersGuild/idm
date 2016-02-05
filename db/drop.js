/* eslint-disable no-console */
import r from 'rethinkdb'

import dbConfig from './config'

export async function drop(config = dbConfig()) {
  const conn = await r.connect(config)
  return await r.dbDrop(config.db).run(conn)
}

async function run() {
  try {
    const config = dbConfig()
    await drop(config)
    console.log(`Successfully dropped database '${config.db}'.`)
    process.exit(0)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

if (!module.parent) {
  run()
}
