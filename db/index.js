/* eslint-disable curly */
import url from 'url'
import rethinkDBDash from 'rethinkdbdash'

const appConfig = require('src/config')

if (!appConfig || !appConfig.server || !appConfig.server.rethinkdb) {
  throw new Error('Rethink db configuration not found')
}

// TODO: address the meh-ness of using module caching to create a singleton
let r = null

const dbUrl = url.parse(appConfig.server.rethinkdb.url)
const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port, 10),
  db: typeof dbUrl.pathname === 'string' ? dbUrl.pathname.slice(1) : undefined,
  authKey: typeof dbUrl.auth === 'string' ? dbUrl.auth.split(':')[1] : undefined,
}
if (appConfig.server.rethinkdb.certificate) {
  dbConfig.ssl = {
    ca: appConfig.server.rethinkdb.certificate
  }
}

export const config = dbConfig

export function connect() {
  if (!r) {
    r = rethinkDBDash({
      servers: [dbConfig],
      silent: true,
    })
  }

  return r
}

export async function create() {
  if (!r) connect()

  try {
    return await r.dbCreate(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}

export async function drop() {
  if (!r) connect()

  try {
    return await r.dbDrop(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}
