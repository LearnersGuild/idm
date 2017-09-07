import test from 'ava'
import nock from 'nock'

import config from 'src/config'
import crmContact from 'src/test/data/hubSpotContact'

import updateContactProperties from '../updateContactProperties'

const crmBaseUrl = config.server.crm.baseURL
const crmKey = config.server.crm.key

test.beforeEach(async () => {
  nock.cleanAll()
  return nock(crmBaseUrl)
    .post(`/contacts/v1/contact/vid/${crmContact.vid}/profile?hapikey=${crmKey}`)
    .reply(204)
})

test('updateContactProperties()', async t => {
  const result = await updateContactProperties(crmContact.vid, [{property: 'idm_id', value: 'fake_idm_id'}])
  t.true(result, 'invalid result')
})
