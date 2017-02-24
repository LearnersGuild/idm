exports.up = async function (r, conn) {
  await r.table('inviteCodes')
    .update({active: true, permanent: false})
    .run(conn)
  await r.table('inviteCodes')
    .filter(r.row('code').match('^DISABLED--'))
    .update({active: false, code: r.row('code').split('DISABLED--', 1).nth(1)})
    .run(conn)
  await r.table('inviteCodes')
    .getAll('st4ff0nly', {index: 'code'})
    .update({permanent: true})
    .run(conn)
}

exports.down = async function (r, conn) {
  await r.table('inviteCodes')
    .filter({active: false})
    .update({code: r.expr('DISABLED--').add(r.row('code'))})
    .run(conn)
  await r.table('inviteCodes')
    .replace(r.row.without('active', 'permanent'))
    .run(conn)
}
