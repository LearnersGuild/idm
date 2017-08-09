import {User, InviteCode} from 'src/server/services/dataService'

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

  const inviteCodesNotRecentlyUsed = [...new Set(
    await User
      .run()
      .filter(user => user.createdAt <= codeExpirationDate)
      .map(user => user.inviteCode)
  )]

  const codesToExpire = await InviteCode
    .getAll(...inviteCodesNotRecentlyUsed, {index: 'code'})
    .filter({active: true, permanent: false})
    .run()
    .map(inviteCode => inviteCode.code)

  return codesToExpire
}

export async function deactivateInviteCodes(codes) {
  if (codes.length > 0) {
    const changedInviteCodes = await InviteCode
      .getAll(...codes, {index: 'code'})
      .update({active: false})

    return changedInviteCodes
  }

  return []
}
