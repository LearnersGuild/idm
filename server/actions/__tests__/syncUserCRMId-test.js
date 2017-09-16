/* global expect */
import test from 'ava'

import factory from 'src/test/factories'
import stubs from 'src/test/stubs'

import syncUserCRMId from '../syncUserCRMId'

test.before(async () => {
  stubs.crmService.enable()
})

test.after(() => {
  stubs.crmService.disable()
})

test.beforeEach(() => {
  stubs.crmService.reset()
})

test.serial('sets user hubspotId and updates hubspot contact custom property `idm_id`', async t => {
  t.plan(0)

  const crmService = require('src/server/services/crmService')
  const {User} = require('src/server/services/dataService')

  const {user} = await _createTestData()

  const testVID = 12345

  stubs.crmService.withArgs('getContactByEmail', user.emails[0]).returns(null)
  stubs.crmService.withArgs('getContactByEmail', user.emails[1]).returns({
    vid: testVID
  })

  await syncUserCRMId(user)

  const updatedUser = await User.get(user.id)
  expect(updatedUser.hubspotId).to.eq(testVID)

  expect(crmService.getContactByEmail).to.have.been.calledWith(user.emails[0])
  expect(crmService.getContactByEmail).to.have.been.calledWith(user.emails[1])
  expect(crmService.updateContactProperties).to.have.been.calledWith(testVID, [
    {property: 'idm_id', value: user.id}, // eslint-disable-line camelcase
  ])
})

test.serial('throws an error if the CRM contact is not found', async t => {
  t.plan(0)

  const {user} = await _createTestData()
  const result = syncUserCRMId(user)
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
