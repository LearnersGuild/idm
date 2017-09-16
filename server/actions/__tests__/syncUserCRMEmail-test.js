/* global expect */
import test from 'ava'

import factory from 'src/test/factories'
import stubs from 'src/test/stubs'

import syncUserCRMEmail from '../syncUserCRMEmail'

test.before(async () => {
  stubs.crmService.enable()
})

test.after(() => {
  stubs.crmService.disable()
})

test.beforeEach(() => {
  stubs.crmService.reset()
})

test.serial('syncs user email with CRM contact email', async t => {
  t.plan(0)

  const hubspotId = 12345
  const {user} = await _createTestData({hubspotId})

  await syncUserCRMEmail(user)

  const crmService = require('src/server/services/crmService')
  expect(crmService.updateContactProperties).to.have.been.calledWith(hubspotId, [
    {property: 'email', value: user.email}, // eslint-disable-line camelcase
  ])
})

test.serial('throws an error if the HubSpot ID is not set', async t => {
  t.plan(0)

  const {user} = await _createTestData()
  const result = syncUserCRMEmail(user)
  return expect(result).to.be.rejectedWith(/HubSpot ID not found/)
})

async function _createTestData(userValues = {}) {
  return {
    user: await factory.create('user', userValues)
  }
}
