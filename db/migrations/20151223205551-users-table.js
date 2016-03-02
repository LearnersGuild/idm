/* eslint-disable no-var */

var r = require('../connect')
var config = require('../config')
var createOptions = config.createOptions

exports.up = function up(r, conn) {
  return r.tableCreate('users', createOptions)
    .run()
    .then(() => {
      r.table('users').indexCreate('email').run()
      return r.table('users').indexCreate('auth0Id').run()
    })
}

exports.down = function down(r, conn) {
  return r.tableDrop('users').run()
}
