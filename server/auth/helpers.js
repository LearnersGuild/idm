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

/**
 * Maps a user profile to a Slack-based identity.
 * (Drastically modified version of https://github.com/auth0/node-samlp/blob/0b29f97b3c36e706d15822e043d3affad1a7609c/lib/claims/PassportProfileMapper.js)
 *
 * @param  {Object} user - the user profile
 */
export function mapSlackUserAttributes(user) {
  return {
    getClaims() {
      const nameParts = user.name.split(/\s+/)
      const claims = {
        'User.Email': user.email,
        'User.Username': user.handle,
      }
      /* eslint-disable camelcase */
      if (nameParts.length > 0) {
        claims.first_name = nameParts[0]
      }
      if (nameParts.length > 1) {
        claims.last_name = nameParts[nameParts.length - 1]
      }
      /* eslint-enable camelcase */
      return claims
    },

    getNameIdentifier() {
      return {
        nameIdentifier: user.id,
        nameIdentifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      }
    },
  }
}
