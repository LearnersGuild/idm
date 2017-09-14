/* global expect */
import test from 'ava'

import factory from 'src/test/factories'
import stubs from 'src/test/stubs'

import {processUserCreated} from '../userCreated'

test.before(async () => {
  stubs.crmService.enable()
})

test.after(() => {
  stubs.crmService.disable()
})

test.beforeEach(() => {
  stubs.crmService.reset()
})

test.serial('syncs newly created user with CRM and sends user data to echo', async t => {
  t.plan(0)

  const crmService = require('src/server/services/crmService')

  const {user} = await _createTestData()

  const testVID = 12345

  stubs.crmService.withArgs('getContactByEmail', user.emails[0]).returns(null)
  stubs.crmService.withArgs('getContactByEmail', user.emails[1]).returns({
    vid: testVID
  })

  await processUserCreated(user)

  expect(crmService.getContactByEmail).to.have.been.calledWith(user.emails[0])
  expect(crmService.getContactByEmail).to.have.been.calledWith(user.emails[1])
  expect(crmService.updateContactProperties).to.have.been.calledWith(testVID, [
    {property: 'idm_id', value: user.id}, // eslint-disable-line camelcase
  ])
})

test.serial('throws an error if the CRM contact is not found', async t => {
  t.plan(0)

  const {user} = await _createTestData()
  const result = processUserCreated(user)
  return expect(result).to.be.rejectedWith(/No contact found/)
})

async function _createTestData() {
  const email1 = 'test1@test.com'
  const email2 = 'test2@test.com'
  return {
    user: await factory.create('user', {
      email: email1,
      emails: [email1, email2],
    })
  }
}
