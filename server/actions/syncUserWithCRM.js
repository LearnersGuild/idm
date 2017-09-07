import {connect} from 'src/db'
import {first} from 'src/server/util'

const r = connect()

export default async function syncUserWithCRM(user) {
  const {updateContactProperties} = require('src/server/services/crmService')

  const contact = await first(user.emails, _getContactByEmailSafe)
  if (!contact) {
    throw new Error(`No contact found with matching email for idm user ${user.id}`)
  }

  console.log(`CRM Match Found: Syncing IDM user ${user.id} with CRM contact ${contact.vid}...`)

  await r.table('users')
    .get(user.id)
    .update({hubspotId: contact.vid})

  const properties = [{property: 'idm_id', value: user.id}]
  await updateContactProperties(contact.vid, properties)
}

async function _getContactByEmailSafe(email) {
  const {getContactByEmail} = require('src/server/services/crmService')
  try {
    return getContactByEmail(email)
  } catch (err) {
    console.log(`Contact not found for email ${email}`)
    return null
  }
}
