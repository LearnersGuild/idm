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
      r.http('http://brand.learnersguild.org/apple-touch-icon-120x120.png', {resultFormat: 'binary'})
    ),
    createdAt: cb => cb(null, now),
    updatedAt: cb => cb(null, now),
  })
}
