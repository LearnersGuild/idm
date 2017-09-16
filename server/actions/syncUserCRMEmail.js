export default async function syncUserEmailWithCRMEmail(user) {
  const {updateContactProperties} = require('src/server/services/crmService')

  if (!user.hubspotId) {
    throw new Error(`Unable to update HubSpot email; HubSpot ID not found for user ${user.id}`)
  }

  const properties = [{property: 'email', value: user.email}]
  await updateContactProperties(user.hubspotId, properties)
}
