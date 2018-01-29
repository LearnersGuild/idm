module.exports = {
  server: {
    secure: false,
    rethinkdb: {
      url: process.env.RETHINKDB_URL || 'rethinkdb://localhost:28015/idm_development',
    },
    redis: {
      url: 'redis://localhost:6379',
    },
    github: {
      callbackURL: 'http://idm.learnersguild.localhost/auth/github/callback',
    },
  },

  app: {
    baseURL: 'http://idm.learnersguild.meh',
    minify: false,
    hotReload: true,
    noErrors: true,
    devTools: true,
  },

  graphiql: {
    baseURL: 'http://graphiql.learnersguild.meh'
  },
}
