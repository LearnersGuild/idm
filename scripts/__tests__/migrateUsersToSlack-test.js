import test from 'ava'
import nock from 'nock'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'

import {
  getSlackUserNamesFromSCIM,
  mapUserAttrs,
  migrateUsers,
  postUserToSlackSCIM,
  SLACK_SCIM_BASE_URL,
  SLACK_SCIM_USERS_PATH,
} from '../migrateUsersToSlack'

const r = connect()

let idmUsers
let slackUserNames
test.before(async () => {
  await resetData()

  idmUsers = await factory.buildMany('user', 10)
  slackUserNames = idmUsers.slice(3).map(user => user.handle)
  await r.table('users').insert(idmUsers)
})

test.after(async () => {
  await cleanupDB()
})

test('mapUserAttrs correctly maps IDM users to Slack', t => {
  const [idmUser] = idmUsers
  const mappedUser = mapUserAttrs(idmUser)
  const {value: primaryEmail} = mappedUser.emails.find(email => email.primary)

  t.is(mappedUser.userName, idmUser.handle, 'handle does not match')
  t.is(mappedUser.active, idmUser.active, 'active does not match')
  t.is(primaryEmail, idmUser.email, 'email does not match')
  t.is(idmUser.name.includes(mappedUser.name.familyName), true, 'name does not match')
  t.is(idmUser.name.includes(mappedUser.name.givenName), true, 'name does not match')
})

test('postUserToSlackSCIM returns the API result', async t => {
  const [idmUser] = idmUsers
  const result = {
    schemas: [
      'urn:scim:schemas:core:1.0'
    ],
    userName: idmUser.handle,
  }

  nock(SLACK_SCIM_BASE_URL)
    .post(SLACK_SCIM_USERS_PATH)
    .reply(201, result)

  const actualResult = await postUserToSlackSCIM(idmUser)
  t.is(actualResult.userName, idmUser.handle, 'results did not match')
})

test('getSlackUserNamesFromSCIM returns the API result', async t => {
  _nockGetUsers()
  const actualResult = await getSlackUserNamesFromSCIM()
  t.deepEqual(actualResult, slackUserNames, 'results did not match')
})

test('migrateUsers calls post function N times', async t => {
  let count = 0
  const incr = () => {
    count++
  }

  _nockGetUsers()
  await migrateUsers(incr)

  t.deepEqual(count, (idmUsers.length - slackUserNames.length), 'post function not invoked correct number of times')
})

function _nockGetUsers() {
  const result = {
    schemas: [
      'urn:scim:schemas:core:1.0'
    ],
    Resources: slackUserNames.map(userName => ({userName}))
  }

  nock(SLACK_SCIM_BASE_URL)
    .get(`${SLACK_SCIM_USERS_PATH}?startIndex=1&count=1000`)
    .reply(201, result)
}
