module.exports = {
  server: {
    secure: false,
    port: 9001,
    rethinkdb: {
      url: process.env.RETHINKDB_URL || 'rethinkdb://localhost:28015/idm_test',
    },
    redis: {
      url: 'redis://localhost:6379',
    },
    github: {
      callbackURL: 'http://idm.learnersguild.test/auth/github/callback',
    },
    crm: {
      baseURL: process.env.CRM_API_BASE_URL || 'http://crm.learnersguild.test',
      key: process.env.CRM_API_KEY || 'this.is.not.a.real.key',
    },
  },

  app: {
    baseURL: 'http://idm.learnersguild.test',
  },

  graphiql: {
    baseURL: 'http://graphiql.learnersguild.test'
  },
}
