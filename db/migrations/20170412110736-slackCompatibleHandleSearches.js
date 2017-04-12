export async function up(r) {
  await r.table('users').indexDrop('handle')
  // slack trims usernames to 21 characters and supports only lowercase
  await r.table('users')
    .indexCreate('handle', r.row('handle').downcase().slice(0, 21))
}

export async function down(r) {
  await r.table('users').indexDrop('handle')
  await r.table('users').indexCreate('handle')
}
