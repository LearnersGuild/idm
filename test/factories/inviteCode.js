import faker from 'faker'

const now = new Date()

export default function define(factory) {
  factory.define('inviteCode', null, {
    id: cb => cb(null, faker.random.uuid()),
    code: cb => cb(null, faker.random.word()),
    description: cb => cb(null, faker.random.words(3)),
    roles: ['player'],
    active: true,
    permanent: false,
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
