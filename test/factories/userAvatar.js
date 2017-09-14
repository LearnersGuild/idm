import faker from 'faker'

import {connect} from 'src/db'
import {UserAvatar} from 'src/server/services/dataService'

const r = connect()
const now = new Date()

export default function define(factory) {
  factory.define('userAvatar', UserAvatar, {
    id: cb => cb(null, faker.random.uuid()),
    jpegData: cb => cb(
      null,
      r.http(faker.random.image(), {resultFormat: 'binary'})
    ),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
