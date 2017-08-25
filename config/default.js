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
      algorithm: 'RS512',
    },
    echo: {
      baseURL: process.env.ECHO_BASE_URL,
    },
    crm: {
      enabled: true,
      baseURL: process.env.CRM_API_BASE_URL,
      key: process.env.CRM_API_KEY,
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.APP_BASE_URL + '/auth/github/callback',
    },
    newrelic: {
      enabled: false,
    },
    aws: {
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_REGION || 'us-west-2',
      },
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
