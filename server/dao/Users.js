import query from 'pg-query'
import Promise from 'bluebird'

import { buildWhereForParams } from './util'


query.connectionParameters = process.env.DATABASE_URL

const queryFirstAsync = Promise.promisify(query.first)


export function find(params) {
  const { clause, values } = buildWhereForParams(params)
  return query(`
  SELECT id, name, email, created_at, updated_at
  FROM   users
  ${clause}
  `, values).then(([rows]) => rows)
}

export function getById(id) {
  return queryFirstAsync(`
  SELECT *
  FROM   users
  WHERE  id = $1
  `, id)
}

export function create(userData) {
  return queryFirstAsync(`
  INSERT INTO users (name, email, _google_auth_info)
  VALUES      ($1, $2, $3)
  RETURNING   id, name, email, created_at, updated_at
  `, [
    userData.name,
    userData.email,
    userData._google_auth_info,
  ])
}

export function update(id, userData) {
  return queryFirstAsync(`
  UPDATE    users
  SET       name = $1,
            _google_auth_info = $2
  WHERE     id = $3
  RETURNING id, name, email, created_at, updated_at
  `, [
    userData.name,
    userData._google_auth_info,
    id
  ])
}

export function findByEmailAndUpdateOrCreate(email, userData) {
  return find({ email })
    .then((results) => results[0])
    .then((result) => {
      if (!result) {
        return create(userData)
      }
      return update(result.id, userData)
    })
}
