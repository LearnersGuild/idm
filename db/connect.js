var configInfo = require('./config')()
var pool = require('rethinkdbdash')({
  servers: [configInfo]
})

module.exports = pool
