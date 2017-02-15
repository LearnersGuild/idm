/* eslint-disable no-console, camelcase */
import url from 'url'
import getBullQueue from 'bull'
import raven from 'raven'
import processChangeFeedWithAutoReconnect from 'rethinkdb-changefeed-reconnect'

import config from 'src/config'
import {connect} from 'src/db'

const r = connect()
const sentry = new raven.Client(config.server.sentryDSN)

export default function configureChangeFeeds() {
  const userCreatedQueue = _getQueue('userCreated')
  processChangeFeedWithAutoReconnect(_getFeed, _getFeedProcessor(userCreatedQueue), _handleConnectionError, {
    changefeedName: 'new users',
  })
}

function _getQueue(queueName) {
  const redisConfig = url.parse(config.server.redis.url)
  const redisOpts = redisConfig.auth ? {auth_pass: redisConfig.auth.split(':')[1]} : undefined
  return getBullQueue(queueName, redisConfig.port, redisConfig.hostname, redisOpts)
}

function _getFeed() {
  // this is not ideal, because if a user has both the 'moderator' and the
  // 'player' role, we'll add that user to the queue twice, so on the other
  // end of the queue, some de-duplication needs to happen
  return r.table('users')
    .getAll('moderator', 'player', {index: 'roles'})
    .changes()
    .filter(r.row('old_val').eq(null))
}

function _getFeedProcessor(userCreatedQueue) {
  return ({new_val: user}) => {
    const jobOpts = {
      attempts: 3,
      backoff: {type: 'fixed', delay: 60000},
    }
    userCreatedQueue.add(user, jobOpts)
  }
}

function _handleConnectionError(err) {
  console.error(err.stack)
  sentry.captureException(err)
}
