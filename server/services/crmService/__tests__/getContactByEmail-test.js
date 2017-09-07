import test from 'ava'
import nock from 'nock'

import config from 'src/config'
import crmContact from 'src/test/data/hubSpotContact'

import getContactByEmail from '../getContactByEmail'

const crmBaseUrl = config.server.crm.baseURL
const crmKey = config.server.crm.key
const contactEmail = crmContact.properties.email.value

test.beforeEach(() => {
  nock.cleanAll()
  nock(crmBaseUrl)
    .get(`/contacts/v1/contact/email/${encodeURIComponent(contactEmail)}/profile?hapikey=${crmKey}`)
    .reply(200, crmContact)
})

test(async t => {
  const result = await getContactByEmail(contactEmail)
  t.truthy(result, 'invalid result')
  t.is(result.vid, crmContact.vid, 'Contact VID does not match crmContact.')
})
