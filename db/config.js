/* eslint-disable no-var, no-console */
var url = require('url')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

var run = !module.parent

function configure(dbUrl, dbCert) {
  dbUrl = dbUrl || process.env.RETHINKDB_URL
  dbCert = dbCert || process.env.RETHINKDB_CERT
  var dbConfig
  var parsedUrl = url.parse(dbUrl)
  dbConfig = {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port, 10),
    db: parsedUrl.pathname ? parsedUrl.pathname.slice(1) : undefined,
    authKey: parsedUrl.auth ? parsedUrl.auth.split(':')[1] : undefined,
  }
  if (dbCert) {
    dbConfig.ssl = {
      ca: dbCert
    }
  }

  return dbConfig
}

var createOptions = {
  replicas: (process.env.NODE_ENV === 'production') ? 3 : 1
}

if (run) {
  console.log(JSON.stringify(configure()))
}

module.exports = configure
module.exports.createOptions = createOptions
