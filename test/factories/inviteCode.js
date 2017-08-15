import faker from 'faker'

import {USER_ROLES} from 'src/common/models/user'

const now = new Date()

export default function define(factory) {
  factory.define('inviteCode', null, {
    id: cb => cb(null, faker.random.uuid()),
    code: cb => cb(null, faker.random.word()),
    description: cb => cb(null, faker.random.words(3)),
    roles: [USER_ROLES.LEARNER],
    active: true,
    permanent: false,
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
