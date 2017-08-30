import BluebirdPromise from 'bluebird'
import fetch from 'isomorphic-fetch'
import minimist from 'minimist'

import {downcaseTrimTo21Chars} from 'src/common/util'
import {User} from 'src/server/services/dataService'
import {connect} from 'src/db'

const r = connect()

export const SLACK_SCIM_BASE_URL = 'https://api.slack.com'
export const SLACK_SCIM_USERS_PATH = '/scim/v1/Users'
export const SLACK_SCIM_USERS_URL = `${SLACK_SCIM_BASE_URL}${SLACK_SCIM_USERS_PATH}`

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

  const slackUser = {
    schemas: ['urn:scim:schemas:core:1.0'],
    userName: downcaseTrimTo21Chars(user.handle), // Slack usernames are limited to 21 chars
    name,
    emails,
    active: user.active,
  }

  const userPhotos = (((user.authProviderProfiles || {}).githubOAuth2) || {}).photos || []
  if (userPhotos.length > 0) {
    slackUser.photos = [{
      value: userPhotos[0].value,
      type: 'photo',
    }]
  }

  return slackUser
}

export function migrateUsers(usersToMigrate, scimAPIToken, postFunc = postUserToSlackSCIM) {
  return BluebirdPromise.map(
    usersToMigrate,
    user => postFunc(user, scimAPIToken),
    {concurrency: 10}
  )
}

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

export function postUserToSlackSCIM(idmUser, scimAPIToken) {
  console.info(`Migrating user ${idmUser.handle} ...`)
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

export function getUsersToMigrate(existingUserNames) {
  console.info('Skipping these users that were already migrated:', existingUserNames)
  return User
    .filter(user => r.expr(existingUserNames).contains(user('handle').downcase().slice(0, 21)).not())
}

export function getSlackUserNamesFromSCIM(scimAPIToken) {
  console.info('Finding users that were already migrated ...')
  const startIndex = 1
  const count = 1000
  return _apiFetch(`${SLACK_SCIM_USERS_URL}?startIndex=${startIndex}&count=${count}`, scimAPIToken)
    .then(users => users.Resources.map(user => user.userName))
}

async function run(scimAPIToken) {
  const existingUserNames = await getSlackUserNamesFromSCIM(scimAPIToken)
  const usersToMigrate = await getUsersToMigrate(existingUserNames)

  await migrateUsers(usersToMigrate, scimAPIToken)
}

if (!module.parent) {
  const argv = minimist(process.argv.slice(2), {alias: {help: 'h'}})
  const usage = 'Usage: migrateUsers SLACK_SCIM_API_TOKEN'
  if (argv.help) {
    console.info(usage)
    process.exit(0)
  }
  if (argv._.length !== 1) {
    console.error('Missing SCIM API token. Try --help.')
    process.exit(1)
  }
  const [scimAPIToken] = argv._

  run(scimAPIToken)
    .then(() => {
      console.info('... done!')
      process.exit(0)
    })
    .catch(err => {
      console.error('Error! Try --help for help.')
      console.error(err.stack || err)
      process.exit(1)
    })
}
