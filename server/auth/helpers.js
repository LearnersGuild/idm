import {merge} from 'lodash'

import {connect} from 'src/db'

const r = connect()

export const defaultSuccessRedirect = '/'

export function mergeUserInfo(user, userInfo) {
  // don't overwrite these attributes
  const {inviteCode, email, name, roles, createdAt, active, id} = user
  return merge(user, userInfo, {inviteCode, email, name, roles, createdAt, active, id})
}

export function addUserAvatar(user) {
  const githubProfilePhotos = (user.authProviderProfiles.githubOAuth2 || {}).photos || []
  const githubProfilePhotoURL = (githubProfilePhotos[0] || {}).value
  return r.table('userAvatars')
    .insert({
      id: user.id,
      jpegData: r.http(githubProfilePhotoURL, {resultFormat: 'binary'})
        .default(null),
      createdAt: r.now(),
      updatedAt: r.now(),
    }, {returnChanges: true})
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
