import BluebirdPromise from 'bluebird'
import fetch from 'isomorphic-fetch'
import minimist from 'minimist'

import {connect} from 'src/db'

const r = connect()

export const SLACK_SCIM_BASE_URL = 'https://api.slack.com'
export const SLACK_SCIM_USERS_PATH = '/scim/v1/Users'
export const SLACK_SCIM_USERS_URL = `${SLACK_SCIM_BASE_URL}${SLACK_SCIM_USERS_PATH}`

function _apiFetch(url, scimAPIToken, opts = {}) {
  const headers = {
    ...(opts.headers || {}),
    Accept: 'application/json',
    Authorization: `Bearer ${scimAPIToken}`,
  }
  const options = {...opts, headers}
  return fetch(url, options)
    .then(resp => {
      return resp.json().then(result => {
        if (!resp.ok) {
          throw new Error(result.Errors.description)
        }
        return result
      })
    })
}

export function mapUserAttrs(user) {
  const nameParts = user.name.split(' ')
  const name = nameParts.length === 1 ?
    {givenName: nameParts[0]} :
    {
      givenName: nameParts[0],
      familyName: nameParts[nameParts.length - 1]
    }

  const allEmails = Array.from(new Set([user.email, ...user.emails]))
  const emails = allEmails.map(email => ({
    value: email,
    primary: email === user.email,
  }))

  return {
    schemas: ['urn:scim:schemas:core:1.0'],
    userName: user.handle,
    name,
    emails,
    photos: [{
      value: user.authProviderProfiles.gihubOAuth2.photos[0].value,
      type: 'photo'
    }],
    active: user.active,
  }
}

export function postUserToSlackSCIM(idmUser, scimAPIToken) {
  const slackUser = mapUserAttrs(idmUser)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(slackUser),
  }
  return _apiFetch(SLACK_SCIM_USERS_URL, scimAPIToken, options)
}

export function getSlackUserNamesFromSCIM(scimAPIToken) {
  const startIndex = 1
  const count = 1000
  return _apiFetch(`${SLACK_SCIM_USERS_URL}?startIndex=${startIndex}&count=${count}`, scimAPIToken)
    .then(users => users.Resources.map(user => user.userName))
}

export function migrateUsers(postFunc = postUserToSlackSCIM) {
  const argv = minimist(process.argv.slice(2), {alias: {help: 'h'}})
  const usage = 'Usage: migrateUsers SLACK_SCIM_API_TOKEN'
  if (argv.help) {
    return Promise.resolve(usage)
  }
  if (argv._.length !== 1) {
    return Promise.reject(usage)
  }

  const [scimAPIToken] = argv._
  return getSlackUserNamesFromSCIM(scimAPIToken)
    .then(userNames => {
      return r.table('users')
        .filter(user => r.expr(userNames).contains(user('handle')).not())
        .then(allUsers => {
          return BluebirdPromise.map(
            allUsers,
            user => postFunc(user, scimAPIToken),
            {concurrency: 10}
          )
        })
    })
}

if (!module.parent) {
  migrateUsers()
    .then(result => {
      console.info(result)
      process.exit(0)
    })
    .catch(err => {
      console.error('Error! Try --help for help.')
      console.error(err.stack || err)
      process.exit(1)
    })
}
