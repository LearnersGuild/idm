exports.up = function up(r, conn) {
  return r.table('users').indexCreate('createdAt').run(conn)
}

exports.down = function down(r, conn) {
  return r.table('users').indexDrop('createdAt').run(conn)
}
