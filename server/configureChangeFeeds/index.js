import userCreated from './userCreated'
import userEmailUpdated from './userEmailUpdated'

export default function configureChangeFeeds() {
  const queueService = require('src/server/services/queueService')
  userCreated(queueService)
  userEmailUpdated(queueService)
}
