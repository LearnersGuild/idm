import test from 'ava'
import nock from 'nock'

import config from 'src/config'
import crmContact from 'src/test/hubSpotContact'

import {
  getContactByEmail,
  updateContactByVID,
} from '../index'

const crmBaseUrl = config.server.crm.baseURL
const crmKey = config.server.crm.key
const contactEmail = encodeURIComponent(crmContact.properties.email.value)

test.before(async () => {
  nock(crmBaseUrl)
    .get(`/contacts/v1/contact/email/${contactEmail}/profile?hapikey=${crmKey}`)
    .reply(200, crmContact)
    .post(`/contacts/v1/contact/vid/${crmContact.vid}/profile?hapikey=${crmKey}`)
    .reply(204)
})

test.after(() => {
  nock.cleanAll()
})

test('getContactByEmail()', async t => {
  const result = await getContactByEmail('tanner+test@learnersguild.org')
  t.truthy(result, 'result returned undefined or null.')
  t.is(result.vid, crmContact.vid, 'Returned VID does not match crmContact.')
})

test('updateContactByVID()', async t => {
  const result = await updateContactByVID(crmContact.vid, [{property: 'idm_id', value: 'fake_idm_id'}])
  console.log(result)
  t.true(result, 'response was not successful.')
})
