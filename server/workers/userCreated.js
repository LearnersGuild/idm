import {connect} from 'src/db'
import {findContactByEmails} from 'src/server/actions/findContactByEmails'
import {addIdmToCrm} from 'src/server/actions/addIdmToCrm'
import createMember from 'src/server/actions/createMember'

const r = connect()

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('userCreated', processUserCreated)
}

export async function processUserCreated(idmUser) {
  try {
    const contact = await findContactByEmails(idmUser.emails)
    if (!contact) {
      throw new Error(`No contact found matching emails for idm user ${idmUser.id}`)
    }

    console.log(`CRM Match Found: Syncing IDM user ${idmUser.id} with CRM contact ${contact.vid}...`)

    await createMember(idmUser.id, idmUser.inviteCode)
    await r.table('users')
      .get(idmUser.id)
      .update({hubspotId: contact.vid})
    await addIdmToCrm(idmUser.id, contact.vid)

    console.log('Done.')
  } catch (error) {
    throw new Error(error.message)
  }
}
