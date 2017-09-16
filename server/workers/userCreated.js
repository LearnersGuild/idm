import syncUserCRMId from 'src/server/actions/syncUserCRMId'

export default async function processUserCreated(user) {
  try {
    await syncUserCRMId(user)
  } catch (err) {
    throw new Error(`Error occurred while attempting to update HubSpot contact: \n${err}`)
  }
}
