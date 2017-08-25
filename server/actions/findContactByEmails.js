import {first} from 'src/server/util'
import {getContactByEmail} from 'src/server/services/crmService'

export async function findContactByEmails(emails) {
  const contact = await first(emails, getContactByEmail)

  if (!contact) {
    throw new Error(`Did not find contact matching emails: ${emails}`)
  }
  return contact
}
