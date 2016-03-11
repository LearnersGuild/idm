/* eslint-disable no-var */

var config = require('../config')
var createOptions = config.createOptions

exports.up = function up(r, conn) {
  return r.tableCreate('users', createOptions)
    .run(conn)
    .then(() => {
      r.table('users').indexCreate('email').run(conn)
      r.table('users').indexCreate('emails', {multi: true}).run(conn)
      r.table('users').indexCreate('googleOAuth2Id', r.row('authProviders')('googleOAuth2')('profile')('id')).run(conn)
      return r.table('users').indexCreate('githubOAuth2Id', r.row('authProviders')('githubOAuth2')('profile')('id')).run(conn)
    })
}

exports.down = function down(r, conn) {
  return r.tableDrop('users').run(conn)
}
