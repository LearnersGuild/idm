import {merge} from 'lodash'

import {connect} from 'src/db'

const r = connect()

export const defaultSuccessRedirect = '/'

export function mergeUserInfo(user, userInfo) {
  // don't overwrite inviteCode
  return merge(user, userInfo, {inviteCode: user.inviteCode})
}

export function createOrUpdateUser(user, userInfo) {
  const timestamps = {updatedAt: r.now()}
  if (user) {
    return r.table('users').update(mergeUserInfo(user, Object.assign({}, userInfo, timestamps)), {returnChanges: true}).run()
  }
  timestamps.createdAt = r.now()
  const newUserDefaults = {active: true}
  return r.table('users').insert(Object.assign({}, newUserDefaults, userInfo, timestamps), {returnChanges: true}).run()
}

export function getUserByGithubId(githubId) {
  return r.table('users')
    .filter({authProviderProfiles: {githubOAuth2: {id: githubId}}})
    .nth(0)
    .default(null)
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
