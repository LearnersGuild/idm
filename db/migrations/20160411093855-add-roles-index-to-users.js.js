exports.up = function up(r, conn) {
  return r.table('users').indexCreate('roles', {multi: true}).run(conn)
}

exports.down = function down(r, conn) {
  return r.table('users').indexDrop('roles').run(conn)
}
