module.exports = {
  server: {
    secure: false,
    port: 9001,
    rethinkdb: {
      url: 'rethinkdb://localhost:28015/idm_development',
    },
    redis: {
      url: 'redis://localhost:6379',
    },
  },

  app: {
    baseURL: 'http://idm.learnersguild.dev',
    minify: false,
    hotReload: true,
    noErrors: true,
    devTools: true,
  },

  graphiql: {
    baseURL: 'http://graphiql.learnersguild.dev'
  },
}
