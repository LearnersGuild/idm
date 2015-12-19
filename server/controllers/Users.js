import {
  find,
  getById,
} from '../dao/Users'


export function findUsers(req, res) {
  find(req.query)
    .then((rows) => res.status(200).json(rows))
    .catch((err) => {
      res.status(500).json({ code: err.code, message: err.toString() })
    })
}

export function getUserById(req, res) {
  getById(req.swagger.params.id.value)
    .then((result) => {
      if (!result) {
        res.status(404).json({ code: '404', message: 'Not Found' })
      }
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(500).json({ code: err.code, message: err.toString() })
    })
}

export function getCurrentUser(req, res) {
  res.status(404).json({ code: '404', message: 'Not Found' })
}
