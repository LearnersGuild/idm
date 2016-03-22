/* eslint-disable no-var */

var config = require('../config')
var createOptions = config.createOptions

exports.up = function up(r, conn) {
  return r.tableCreate('inviteCodes', createOptions)
    .run(conn)
    .then(() => {
      return r.table('inviteCodes').indexCreate('code').run(conn)
    })
}

exports.down = function down(r, conn) {
  return r.tableDrop('inviteCodes').run(conn)
}
