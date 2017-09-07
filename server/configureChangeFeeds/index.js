import userCreated from './userCreated'

export default function configureChangeFeeds() {
  const queueService = require('src/server/services/queueService')
  userCreated(queueService)
}
