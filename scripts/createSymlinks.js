import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const LINK_DIR = path.resolve(__dirname, '../node_modules/src')
const LINK_TARGET_DIR = path.resolve(__dirname, '..')

const SYMLINK_NAMES = [
  'client',
  'common',
  'config',
  'db',
  'scripts',
  'server',
  'test',
  'webpack',
]

export default function createSymlinks() {
  console.log('Deleting dir:', LINK_DIR)
  rimraf.sync(LINK_DIR)

  console.log('Creating dir:', LINK_DIR)
  fs.mkdirSync(LINK_DIR)

  console.log('Creating symlinks')
  SYMLINK_NAMES.forEach(linkName => {
    const linkPath = `${LINK_DIR}/${linkName}`
    const linkTarget = `${LINK_TARGET_DIR}/${linkName}`
    fs.symlinkSync(linkTarget, linkPath, 'dir')
  })
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  try {
    createSymlinks()
    process.exit(0)
  } catch (err) {
    console.error('Processing error:', err)
    process.exit(1)
  }
}
