import syncUserCRMId from 'src/server/actions/syncUserCRMId'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('userCreated', processUserCreated)
}

export async function processUserCreated(user) {
  try {
    await syncUserCRMId(user)
  } catch (err) {
    throw new Error(`Error occurred while attempting to update HubSpot contact: \n${err}`)
  }
}
