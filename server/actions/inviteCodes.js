import {connect} from 'src/db'

const r = connect()

export async function findInviteCodesToExpire(since = null) {
  let codeExpirationDate = since
  if (!codeExpirationDate) {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    codeExpirationDate = new Date(Date.UTC(
      twoWeeksAgo.getFullYear(),
      twoWeeksAgo.getMonth(),
      twoWeeksAgo.getDate(),
      0, 0, 0, 0
    ))
  }

  const inviteCodesNotRecentlyUsed = await r.table('users')
    .filter(user => user('createdAt').gt(codeExpirationDate).not())('inviteCode')
    .distinct()

  const codesToExpire = await r.table('inviteCodes')
    .getAll(...inviteCodesNotRecentlyUsed, {index: 'code'})
    .filter({active: true, permanent: false})('code')

  return codesToExpire
}

export async function expireInviteCodes(codes) {
  if (codes.length > 0) {
    const {replaced: numChangedCodes} = await r.table('inviteCodes')
      .getAll(...codes, {index: 'code'})
      .update({active: false})

    return numChangedCodes
  }

  return 0
}

export default expireInviteCodes
