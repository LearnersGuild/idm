export default function createJob(jobQueueName, jobPayload, jobOptions) {
  const queueService = require('src/server/services/queueService')
  return queueService.getQueue(jobQueueName).add(jobPayload, jobOptions)
}
