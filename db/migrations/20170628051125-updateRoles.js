/* eslint-disable no-use-extend-native/no-use-extend-native */
import Promise from 'bluebird'

const ROLE_REPLACEMENTS = {
  player: 'member',
  backoffice: 'admin',
  sysadmin: 'admin',
  moderator: 'admin',
  proplayer: 'admin',
  sep: 'admin',
  learningfacilitator: 'admin',
}

export function up(r, conn) {
  return Promise.each(Object.keys(ROLE_REPLACEMENTS), oldRole => {
    const newRole = ROLE_REPLACEMENTS[oldRole]
    return r.table('users')
      .getAll(oldRole, {index: 'roles'})
      .update(user => ({
        roles: user('roles')
          .setDifference([oldRole])
          .setUnion([newRole])
      }))
      .run(conn)
  })
}

export function down(r, conn) {
  return Promise.each(Object.keys(ROLE_REPLACEMENTS), oldRole => {
    const newRole = ROLE_REPLACEMENTS[oldRole]
    return r.table('users')
      .getAll(newRole, {index: 'roles'})
      .update(user => ({
        roles: user('roles')
          .setDifference([newRole])
          .setUnion([oldRole])
      }))
      .run(conn)
  })
}
