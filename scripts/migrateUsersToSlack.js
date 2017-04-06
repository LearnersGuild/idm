import BluebirdPromise from 'bluebird'
import fetch from 'isomorphic-fetch'

import {connect} from 'src/db'

const r = connect()

export const SLACK_SCIM_BASE_URL = 'https://api.slack.com'
export const SLACK_SCIM_USERS_PATH = '/scim/v1/Users'
export const SLACK_SCIM_USERS_URL = `${SLACK_SCIM_BASE_URL}${SLACK_SCIM_USERS_PATH}`

// TODO: accept the token as a parameter

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

export function postUserToSlackSCIM(idmUser) {
  const slackUser = mapUserAttrs(idmUser)
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_SCIM_API_AUTH_DEV}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(slackUser),
  }
  return fetch(SLACK_SCIM_USERS_URL, options)
    .then(resp => resp.json())
}

export function getSlackUserNamesFromSCIM() {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_SCIM_API_AUTH_DEV}`,
      'Content-Type': 'application/json'
    },
  }
  const startIndex = 1
  const count = 1000
  return fetch(`${SLACK_SCIM_USERS_URL}?startIndex=${startIndex}&count=${count}`, options)
    .then(resp => resp.json())
    .then(users => users.Resources.map(user => user.userName))
}

export function migrateUsers(postFunc = postUserToSlackSCIM) {
  return getSlackUserNamesFromSCIM()
    .then(userNames => {
      return r.table('users')
        .filter(user => r.expr(userNames).contains(user('handle')).not())
        .then(allUsers => {
          return BluebirdPromise.map(
            allUsers,
            user => postFunc(user),
            {concurrency: 10}
          )
        })
    })
}

if (!module.parent) {
  migrateUsers()
    .then(result => {
      console.info('Done!', result)
      process.exit(0)
    })
    .catch(err => {
      console.error(err.stack || err)
      process.exit(1)
    })
}
