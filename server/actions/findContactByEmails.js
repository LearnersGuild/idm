import {first} from 'src/server/util'

export async function findContactByEmails(emails) {
  const {getContactByEmail} = require('src/server/services/crmService')

  const contact = await first(emails, getContactByEmail)
  if (!contact) {
    throw new Error(`Did not find contact matching emails: ${emails}`)
  }

  return contact
}
