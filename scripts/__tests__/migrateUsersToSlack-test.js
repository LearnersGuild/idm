import test from 'ava'
import nock from 'nock'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'
import factory from 'src/test/factories'

import {
  mapUserAttrs,
  migrateUsers,
  postUserToSlackSCIM,
  getSlackUserNamesFromSCIM,
  getUsersToMigrate,
  SLACK_SCIM_BASE_URL,
  SLACK_SCIM_USERS_PATH,
} from '../migrateUsersToSlack'

const r = connect()

const scimAPIToken = 'this-is-a-fake-token'
let idmUsers
let slackUserNames
test.before(async () => {
  await resetData()

  idmUsers = await factory.buildMany('user', 10)
  slackUserNames = idmUsers.slice(3).map(user => user.handle.toLowerCase().slice(0, 21))
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

test('migrateUsers calls post function N times', async t => {
  let count = 0
  const incr = () => {
    count++
  }

  await migrateUsers(idmUsers, scimAPIToken, incr)

  t.deepEqual(count, idmUsers.length, 'post function not invoked correct number of times')
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

  const actualResult = await postUserToSlackSCIM(idmUser, scimAPIToken)
  t.is(actualResult.userName, idmUser.handle, 'results did not match')
})

test('getUsersToMigrate returns all users except ones with the passed-in usernames', async t => {
  const usersToMigrate = await getUsersToMigrate(slackUserNames)
  t.is(usersToMigrate.length, idmUsers.length - slackUserNames.length)
  usersToMigrate.forEach(user => {
    t.is(slackUserNames.includes(user.handle), false, 'should not return users with matching usernames')
  })
})

test('getSlackUserNamesFromSCIM returns the API result', async t => {
  _nockGetUsers()
  const actualResult = await getSlackUserNamesFromSCIM(scimAPIToken)
  t.deepEqual(actualResult, slackUserNames, 'results did not match')
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
