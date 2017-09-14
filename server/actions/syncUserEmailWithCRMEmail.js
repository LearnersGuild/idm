export default async function syncUserEmailWithCRMEmail(user) {
  if (!user.hubspotId) {
    throw new Error(`Unable to update HubSpot email because no HubSpot ID found for user ${user.handle}`)
  }

  const {updateContactProperties} = require('src/server/services/crmService')

  const properties = [{property: 'email', value: user.email}]
  await updateContactProperties(user.hubspotId, properties)
}
