import raven from 'raven'

import config from 'src/config'

const sentry = new raven.Client(config.server.sentryDSN)

export default function _handleConnectionError(err) {
  console.error(`ERROR Configuring Change Feeds: ${err.stack ? err.stack : err}`)
  sentry.captureException(err)
}
