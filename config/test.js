module.exports = {
  server: {
    secure: false,
    port: 9001,
    rethinkdb: {
      url: 'rethinkdb://localhost:28015/idm_test',
    },
    redis: {
      url: 'redis://localhost:6379',
    },
    github: {
      callbackURL: 'http://idm.learnersguild.test/auth/github/callback',
    },
  },

  app: {
    baseURL: 'http://idm.learnersguild.test',
  },

  graphiql: {
    baseURL: 'http://graphiql.learnersguild.test'
  },
}
