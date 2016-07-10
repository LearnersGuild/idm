/* eslint-disable prefer-template */
/** Auto-merged environment-specific configuration. */

module.exports = {
  server: {
    secure: true,
    port: process.env.PORT || '9001',
    sentryDSN: process.env.SENTRY_SERVER_DSN,
    rethinkdb: {
      url: process.env.RETHINKDB_URL,
      certificate: process.env.RETHINKDB_CERT,
      replicas: 1,
    },
    redis: {
      url: process.env.REDIS_URL
    },
    jwt: {
      privateKey: process.env.JWT_PRIVATE_KEY,
      publicKey: process.env.JWT_PUBLIC_KEY,
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.APP_BASE_URL + '/auth/github/callback',
    },
    newrelic: {
      enabled: false,
    },
  },

  app: {
    baseURL: process.env.APP_BASE_URL,
    sentryDSN: process.env.SENTRY_CLIENT_DSN,
    minify: true,
    hotReload: false,
    devTools: false,
    noErrors: false
  },

  graphiql: {
    baseURL: process.env.GRAPHIQL_BASE_URL
  },
}
