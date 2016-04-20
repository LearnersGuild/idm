/* eslint-disable no-var */
var rethinkDBDash = require('rethinkdbdash')
var dbConfigure = require('./config')

function createPool(dbUrl, dbCert) {
  var configInfo = dbConfigure(dbUrl, dbCert)
  return rethinkDBDash({
    servers: [configInfo]
  })
}

module.exports = createPool()
module.exports.createPool = createPool
