import {connect} from 'src/db'

const r = connect()

async function expireInviteCodes() {
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const twoWeeksAgoMidnightUTC = new Date(Date.UTC(twoWeeksAgo.getFullYear(), twoWeeksAgo.getMonth(), twoWeeksAgo.getDate(), 0, 0, 0, 0))

  const expiredCodes = await r.table('users')
    .filter(user => user('createdAt').lt(twoWeeksAgoMidnightUTC))('inviteCode')
    .distinct()

  const activeTemporaryExpiredCodes = await r.table('inviteCodes')
    .getAll(...expiredCodes, {index: 'code'})
    .filter({active: true, permanent: false})('code')

  if (activeTemporaryExpiredCodes.length > 0) {
    console.info('Expiring these invite codes:', activeTemporaryExpiredCodes.join(', '), '...')

    await r.table('inviteCodes')
      .getAll(...activeTemporaryExpiredCodes, {index: 'code'})
      .update({active: false})

    console.info('... done.')
  } else {
    console.info('No invite codes to expire.')
  }
}

export default expireInviteCodes

if (!module.parent) {
  expireInviteCodes()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Processing error:', err)
      process.exit(1)
    })
}
