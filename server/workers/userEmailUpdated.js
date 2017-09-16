import syncUserCRMEmail from 'src/server/actions/syncUserCRMEmail'

export default async function processUserEmailUpdated(user) {
  try {
    await syncUserCRMEmail(user)
  } catch (err) {
    throw new Error(`Error occurred while attempting to update HubSpot contact email: \n${err}`)
  }
}
