/* eslint-disable curly */
import url from 'url'
import rethinkDBDash from 'rethinkdbdash'

const appConfig = require('src/config')

if (!appConfig || !appConfig.server || !appConfig.server.rethinkdb) {
  throw new Error('Rethink db configuration not found')
}

export function config(dbName = null) {
  const dbUrl = url.parse(appConfig.server.rethinkdb.url)
  const db = dbName || (typeof dbUrl.pathname === 'string' ? dbUrl.pathname.slice(1) : undefined)
  const dbConfig = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10),
    db,
    authKey: typeof dbUrl.auth === 'string' ? dbUrl.auth.split(':')[1] : undefined,
  }
  if (appConfig.server.rethinkdb.certificate) {
    dbConfig.ssl = {
      ca: appConfig.server.rethinkdb.certificate
    }
  }

  return {...dbConfig, db}
}

// TODO: address the meh-ness of using module caching to create a singleton
let r = null
export function connect(dbConfig = config()) {
  if (!r) {
    r = rethinkDBDash({
      servers: [dbConfig],
      silent: true,
      max: 100,
      buffer: 10,
    })
  }
  return r
}

export async function create(dbConfig = config()) {
  if (!r) connect(dbConfig)
  try {
    return await r.dbCreate(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}

export async function drop(dbConfig = config()) {
  if (!r) connect(dbConfig)
  try {
    return await r.dbDrop(dbConfig.db).run()
  } catch (err) {
    console.error(err.stack)
  }
}
