import {fetchCRM} from './util'

export default function getContactByEmail(email) {
  return fetchCRM(`/contacts/v1/contact/email/${encodeURIComponent(email)}/profile`)
}
