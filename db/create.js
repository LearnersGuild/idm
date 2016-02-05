/* eslint-disable no-console */
import r from 'rethinkdb'

import dbEnv from './config'

const run = !module.parent

export function create() {
  return r.connect(dbEnv())
    .then(conn => {
      return r.dbCreate(dbEnv().db)
        .run(conn)
    })
}

if (run) {
  create()
    .then(() => {
      console.log(`Successfully created database '${dbEnv().db}'.`)
      process.exit(0)
    })
    .catch(result => {
      console.error(result.message)
      process.exit(1)
    })
}
