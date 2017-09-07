import {fetchCRM} from './util'

export default async function updateContactProperties(contactVID, properties) {
  await fetchCRM(`/contacts/v1/contact/vid/${contactVID}/profile`, {
    method: 'POST',
    body: JSON.stringify({properties}),
  })

  return true // hubspot API returns statusCode 204 with no body
}
