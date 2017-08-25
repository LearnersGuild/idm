module.exports = {
  server: {
    rethinkdb: {
      replicas: 3,
    },
    newrelic: {
      enabled: true,
    },
    crm: {
      enabled: true,
    },
  },
}
