import {InviteCode} from 'src/server/services/dataService'

export default async function deactivateInviteCodes(codes) {
  if (Array.isArray(codes) && codes.length > 0) {
    const changedInviteCodes = await InviteCode
      .getAll(...codes, {index: 'code'})
      .update({active: false})

    return changedInviteCodes
  }

  return []
}
