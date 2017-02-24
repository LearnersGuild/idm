import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import {up} from 'rethink-migrate'

import {config, connect, create, drop} from 'src/db'

export function configureDB() {
  // use one database per-process b/c ava runs tests in parallel
  const db = `idm_test_${Date.now()}_${Math.floor(Math.random() * 10000000)}`
  const dbConfig = config(db)
  connect(dbConfig)

  return dbConfig
}

export async function resetData() {
  // use one database per-process b/c ava runs tests in parallel
  await create(global.dbConfig)

  // rethink-migrate has a _terrible_ API. ugh.
  // YES, all of this is necessary
  const src = path.resolve(__dirname, '..')
  const tmp = path.resolve(src, '..', 'tmp')
  if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp)
  }
  const root = path.resolve(tmp, global.dbConfig.db)
  fs.mkdirSync(root)
  const dbConfigFilename = path.resolve(root, 'database.json')
  fs.writeFileSync(dbConfigFilename, JSON.stringify(global.dbConfig))
  fs.symlinkSync(path.resolve(src, 'node_modules'), path.resolve(root, 'node_modules'), 'dir')
  fs.symlinkSync(path.resolve(src, 'db', 'migrations'), path.resolve(root, 'migrations'), 'dir')
  const currDir = process.cwd()
  process.chdir(root)
  await up({root, logLevel: 'error'})
  process.chdir(currDir)
  rimraf.sync(root)
}

export async function cleanupDB() {
  await drop(global.dbConfig)
}

export function drainPool() {
  const r = connect()
  return r.getPoolMaster().drain()
}
