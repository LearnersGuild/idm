/* eslint-disable no-use-extend-native/no-use-extend-native */
import Promise from 'bluebird'

import {connect} from 'src/db'

const r = connect()

export function resetData() {
  return r.tableList()
    .then(tables => tables.filter(t => !t.startsWith('_')))
    .then(tablesToTruncate => Promise.each(tablesToTruncate, t => (
      r.table(t).delete().run()
    )))
}

export function drainPool() {
  return r.getPoolMaster().drain()
}
