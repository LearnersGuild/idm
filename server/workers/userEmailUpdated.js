import syncUserEmailWithCRMEmail from 'src/server/actions/syncUserEmailWithCRMEmail'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('userEmailUpdated', processUserEmailUpdated)
}

export async function processUserEmailUpdated(user) {
  try {
    await syncUserEmailWithCRMEmail(user)
  } catch (err) {
    throw new Error(`Error occurred while attempting to update HubSpot contact email: \n${err}`)
  }
}
