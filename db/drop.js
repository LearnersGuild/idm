/* eslint-disable no-console */
import r from 'rethinkdb'

import dbEnv from './config'

const run = !module.parent

export function drop() {
  return r.connect(dbEnv())
    .then(conn => {
      return r.dbDrop(dbEnv().db)
        .run(conn)
    })
}

if (run) {
  drop()
    .then(() => {
      console.log(`Successfully dropped database '${dbEnv().db}'.`)
      process.exit(0)
    })
    .catch(result => {
      console.error(result.message)
      process.exit(1)
    })
}
