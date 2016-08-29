/* eslint-disable curly */
import url from 'url'
import rethinkDBDash from 'rethinkdbdash'

const config = require('src/config')

if (!config || !config.server || !config.server.rethinkdb) {
  throw new Error('Rethink db configuration not found')
}

const dbUrl = url.parse(config.server.rethinkdb.url)
const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port, 10),
  db: typeof dbUrl.pathname === 'string' ? dbUrl.pathname.slice(1) : undefined,
  authKey: typeof dbUrl.auth === 'string' ? dbUrl.auth.split(':')[1] : undefined,
}

if (config.server.rethinkdb.certificate) {
  dbConfig.ssl = {
    ca: config.server.rethinkdb.certificate
  }
}

/**
 * TODO: address the meh-ness of piggybacking on module caching
 * to construct what's essentially being used as a singleton
 */
let r = null

function connect() {
  if (!r) {
    r = rethinkDBDash({
      servers: [dbConfig]
    })
  }

  return r
}

async function create() {
  if (!r) connect()

  try {
    return await r.dbCreate(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}

async function drop() {
  if (!r) connect()

  try {
    return await r.dbDrop(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}

module.exports.connect = connect
module.exports.create = create
module.exports.drop = drop
module.exports.config = dbConfig
