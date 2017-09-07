import {USER_ROLES} from 'src/common/models/user'

const {ADMIN, MEMBER} = USER_ROLES

const GENERAL_USE = [
  ADMIN,
  MEMBER
]

const CAPABILITY_ROLES = {
  createInviteCode: [ADMIN],
  deactivateUser: [ADMIN],
  reactivateUser: [ADMIN],
  updateUser: [ADMIN],
  viewAllUsers: [ADMIN],
  viewOwnProfile: GENERAL_USE,
  viewHome: GENERAL_USE,
}

export default function userCan(currentUser, capability) {
  if (!currentUser) {
    return false
  }
  const {roles} = currentUser
  if (!roles) {
    return false
  }
  if (!CAPABILITY_ROLES[capability]) {
    throw new Error(`No such capability '${capability}'`)
  }
  const permitted = roles.filter(role => (
    CAPABILITY_ROLES[capability].indexOf(role) >= 0
  )).length > 0

  return permitted
}
