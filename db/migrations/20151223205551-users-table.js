/* eslint-disable no-var */

var config = require('../config')()

exports.up = function up(r, conn) {
  return r.db(config.db)
    .tableCreate('users')
    .run(conn)
    .then(() => {
      return r.db(config.db)
        .table('users')
        .indexCreate('email')
        .run(conn)
    })
}

exports.down = function down(r, conn) {
  return r.db(config.db)
    .tableDrop('users')
    .run(conn)
}
