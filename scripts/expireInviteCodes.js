import findInviteCodesToExpire from 'src/server/actions/findInviteCodesToExpire'
import expireInviteCodes from 'src/server/actions/expireInviteCodes'

async function expireOldInviteCodes() {
  const inviteCodesToExpire = await findInviteCodesToExpire()

  if (inviteCodesToExpire.length > 0) {
    console.info('Expiring these invite codes:', inviteCodesToExpire.join(', '), '...')

    const numExpired = await expireInviteCodes(inviteCodesToExpire)

    console.info(`... done. Expired ${numExpired} invite code(s).`)
  } else {
    console.info('No invite codes to expire.')
  }
}

if (!module.parent) {
  expireOldInviteCodes()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Processing error:', err)
      process.exit(1)
    })
}
