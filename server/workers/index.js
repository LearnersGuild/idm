const processUserCreated = require('./userCreated')
const processUserEmailUpdated = require('./userEmailUpdated')

function startWorker(queueName, processJob) {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs(queueName, processJob)
}

// start workers
startWorker('userCreated', processUserCreated)
startWorker('userEmailUpdated', processUserEmailUpdated)

// start change feed listeners
require('src/server/configureChangeFeeds')()
