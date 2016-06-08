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
  },

  app: {
    baseURL: 'http://idm.learnersguild.test',
  },

  graphiql: {
    baseURL: 'http://graphiql.learnersguild.test'
  },
}
