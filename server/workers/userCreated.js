import syncUserIDWithCRMID from 'src/server/actions/syncUserIDWithCRMID'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('userCreated', processUserCreated)
}

export async function processUserCreated(user) {
  try {
    await syncUserIDWithCRMID(user)
  } catch (err) {
    throw new Error(`Error occurred while attempting to update HubSpot contact: \n${err}`)
  }
}
