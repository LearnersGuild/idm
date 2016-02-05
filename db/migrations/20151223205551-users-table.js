/* eslint-disable no-var */

var config = require('../config')
var createOptions = config.createOptions

exports.up = function up(r, conn) {
  var configInfo = config()
  return r.db(configInfo.db)
    .tableCreate('users', createOptions)
    .run(conn)
    .then(() => {
      return r.db(configInfo.db)
        .table('users')
        .indexCreate('email')
        .run(conn)
    })
}

exports.down = function down(r, conn) {
  var configInfo = config()
  return r.db(configInfo.db)
    .tableDrop('users')
    .run(conn)
}
