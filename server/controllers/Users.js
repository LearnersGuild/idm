import r from 'rethinkdb'
import raven from 'raven'

import getDBConfig from '../../db/config'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export function findUsers(req, res) {
  r.connect(getDBConfig())
    .then((conn) => {
      r.table('users')
        .filter(req.query)
        .run(conn)
        .then((cursor) => cursor.toArray())
        .then((users) => res.status(200).json(users))
    })
    .catch((err) => {
      sentry.captureException(err)
      res.status(500).json({ code: err.code, message: err.msg })
    })
}

export function getUserById(req, res) {
  r.connect(getDBConfig())
    .then((conn) => {
      r.table('users')
        .get(req.swagger.params.id.value)
        .run(conn)
        .then((user) => {
          if (!user) {
            return res.status(404).json({ code: '404', message: 'Not Found' })
          }
          return res.status(200).json(user)
        })
    })
    .catch((err) => {
      sentry.captureException(err)
      res.status(500).json({ code: err.code, message: err.msg })
    })
}

export function getCurrentUser(req, res) {
  res.status(404).json({ code: '404', message: 'Not Found' })
}
