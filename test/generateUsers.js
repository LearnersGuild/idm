import path from 'path'
import parseArgs from 'minimist'

import 'src/config'
import {createUsers} from './helpers'
import {drainPool} from './db'

function printUsage(logger = console.error) {
  const command = path.basename(process.argv[1])
  logger(
`Usage:
    ${command} [OPTIONS] INVITE_CODE

Options:
    --help              print this help message
    --role=ROLE[,ROLE]  create users with these roles (default: 'player')
    --count             how many users to create (default: 15)
    --verbose           print out ids of created users
`
  )
}

function parseRole(roleStr) {
  return typeof roleStr === 'string' ?
    roleStr.split(',').map(s => s.trim().toLowerCase()) :
    null
}

async function run() {
  try {
    const {
      help,
      role: roleStr,
      count: countStr,
      verbose,
      _: [inviteCode]
    } = parseArgs(process.argv.slice(2), {
      boolean: ['help', 'verbose'],
      string: ['role', 'count'],
    })
    if (help) {
      printUsage(console.info)
      return 0
    }
    if (!inviteCode) {
      console.error('\nERROR: INVITE_CODE is required. Try --help for usage.\n')
      return 1
    }

    const role = parseRole(roleStr) || 'player'
    const count = countStr ? parseInt(countStr, 10) : 15

    const users = await createUsers(inviteCode, role, count)
    if (verbose) {
      users.forEach(user => console.info(user.id))
    }
    return 0
  } catch (err) {
    console.error('Error:', err.stack || err)
  } finally {
    drainPool()
  }
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  run().then(retVal => process.exit(retVal))
}
