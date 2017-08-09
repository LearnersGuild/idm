import {connect} from 'src/db'
import {User, UserAvatar, InviteCode} from 'src/server/services/dataService'

const r = connect()

export const defaultSuccessRedirect = '/'

export function mergeUserInfo(userInfo) {
  const {handle, emails, authProviders, authProviderProfiles} = userInfo
  return {handle, emails, authProviders, authProviderProfiles}
}

export function saveUserAvatar(user) {
  const githubProfilePhotos = (user.authProviderProfiles.githubOAuth2 || {}).photos || []
  const githubProfilePhotoURL = (githubProfilePhotos[0] || {}).value
  return UserAvatar
    .save({
      id: user.id,
      jpegData: r.http(githubProfilePhotoURL, {resultFormat: 'binary'})
        .default(null),
    })
}

export async function getUserByGithubId(githubId) {
  const user = await User
    .filter({authProviderProfiles: {githubOAuth2: {id: githubId}}})

  return user[0]
}

export function getInviteCodesByCode(code) {
  return InviteCode.getAll(code, {index: 'code'}).limit(1).run()
}
