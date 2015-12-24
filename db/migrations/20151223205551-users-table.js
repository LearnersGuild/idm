var config = require('../config')()

exports.up = function up(r, conn) {
  return r.db(config.db)
    .tableCreate('users')
    .run(conn)
}

exports.down = function down(r, conn) {
  return r.db(config.db)
    .tableDrop('users')
    .run(conn)
}
