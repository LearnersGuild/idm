/* eslint-disable no-var */
var config = require('src/config')

exports.up = function up(r, conn) {
  return r.tableCreate('inviteCodes', {replicas: config.server.rethinkdb.replicas})
    .run(conn)
    .then(() => {
      return r.table('inviteCodes').indexCreate('code').run(conn)
    })
}

exports.down = function down(r, conn) {
  return r.tableDrop('inviteCodes').run(conn)
}
