exports.up = function (r, connection) {
  return r.table('users')
    .update({active: true})
    .run(connection)
}

exports.down = function (r, connection) {
  return r.table('users')
    .replace(user => user.without('active'))
    .run(connection)
}
