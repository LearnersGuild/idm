import {User, InviteCode} from 'src/server/services/dataService'

export default async function findInviteCodesToExpire(since = null) {
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

  const inviteCodesNotRecentlyUsed = await User
    .filter(row => row('createdAt').gt(codeExpirationDate).not())
    .map(row => row('inviteCode'))
    .distinct()
    .execute()

  const codesToExpire = await InviteCode
    .getAll(...inviteCodesNotRecentlyUsed, {index: 'code'})
    .filter({active: true, permanent: false})
    .map(row => row('code'))
    .execute()

  return codesToExpire
}
