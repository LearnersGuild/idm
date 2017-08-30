import faker from 'faker'

import {USER_ROLES} from 'src/common/models/user'
import {User} from 'src/server/services/dataService'

const VALID_TIMEZONES = ['America/Los_Angeles', 'America/Chicago', 'America/New_York']
const now = new Date()

export default function define(factory) {
  factory.define('user', User, {
    id: cb => cb(null, faker.random.uuid()),
    email: cb => cb(null, faker.internet.exampleEmail()),
    emails: cb => cb(null, [faker.internet.exampleEmail(), faker.internet.exampleEmail()]),
    handle: cb => cb(null, `${faker.random.word()}${faker.random.number({max: 100})}`.toLowerCase()),
    name: cb => cb(null, faker.name.findName()),
    phone: cb => cb(null, faker.phone.phoneNumber('(###) ###-####')),
    dateOfBirth: cb => cb(null, faker.date.past(21).toISOString().slice(0, 10)),
    timezone: cb => cb(null, faker.random.arrayElement(VALID_TIMEZONES)),
    active: true,
    roles: [USER_ROLES.LEARNER],
    inviteCode: 'test',
    authProviders: {},
    authProviderProfiles: {
      gihubOAuth2: {
        photos: [{
          value: faker.internet.url(),
          type: 'photo',
        }],
      },
    },
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
