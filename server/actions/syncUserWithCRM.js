import {connect} from 'src/db'
import {findContactByEmails} from 'src/server/actions/findContactByEmails'

const r = connect()

export default async function syncUserWithCRM(user) {
  const {updateContactProperties} = require('src/server/services/crmService')

  const contact = await findContactByEmails(user.emails)
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
