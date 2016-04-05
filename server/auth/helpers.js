import {merge} from 'lodash'

import r from '../../db/connect'

export const defaultSuccessRedirect = '/'

export function mergeUserInfo(user, userInfo) {
  // don't overwrite primary email address or inviteCode
  return merge(user, userInfo, {email: user.email, inviteCode: user.inviteCode})
}

export function createOrUpdateUser(user, userInfo) {
  const timestamps = {updatedAt: r.now()}
  if (user) {
    return r.table('users').update(mergeUserInfo(user, userInfo), {returnChanges: true}).run()
  }
  timestamps.createdAt = r.now()
  return r.table('users').insert(userInfo, {returnChanges: true}).run()
}

export function getUsersForEmails(emails) {
  return r.table('users').getAll(...emails, {index: 'emails'}).distinct().run()
}

export function getUserById(id) {
  return r.table('users')
    .get(id)
    .do(user => {
      return r.branch(
        user.ne(null),
        user.pluck('id', 'email', 'emails', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone', 'roles', 'authProviders'),
        null
      )
    })
    .run()
}

export function getInviteCodesByCode(code) {
  return r.table('inviteCodes').getAll(code, {index: 'code'}).limit(1).run()
}
