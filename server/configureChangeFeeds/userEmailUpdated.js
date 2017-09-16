/* eslint-disable no-console, camelcase */
import processChangeFeedWithAutoReconnect from 'rethinkdb-changefeed-reconnect'

import {connect} from 'src/db'
import handleConnectionError from './util/handleConnectionError'

const r = connect()

export default function userEmailUpdated(queueService) {
  processChangeFeedWithAutoReconnect(
    _getFeed,
    _getFeedProcessor(queueService),
    handleConnectionError,
    {changefeedName: 'user email updated'}
  )
}

function _getFeed() {
  return r.table('users')
    .changes()
    .filter(
      r.row('old_val').ne(null)('email')
        .ne(
          r.row('new_val')('email')
        )
    )
}

function _getFeedProcessor(queueService) {
  const userEmailUpdatedQueue = queueService.getQueue('userEmailUpdated')
  return ({new_val: user}) => {
    const jobOpts = {
      attempts: 3,
      backoff: {type: 'fixed', delay: 60000},
    }
    userEmailUpdatedQueue.add(user, jobOpts)
  }
}
