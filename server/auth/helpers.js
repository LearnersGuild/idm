import {merge} from 'lodash'
import jwt from 'jsonwebtoken'

import r from '../../db/connect'

export function createOrUpdateUser(user, userInfo) {
  return user ? (
    r.table('users').update(merge(user, userInfo), {returnChanges: true}).run()
  ) : (
    r.table('users').insert(userInfo, {returnChanges: true}).run()
  )
}

export function getUserById(id) {
  return r.table('users').get(id).pluck('id', 'email', 'name').run()
}

export function setJWTCookie(req, res) {
  const token = jwt.sign({iss: 'idm.learnersguild.org', sub: req.user.id}, process.env.SHARED_JWT_SECRET)
  const secure = (process.env.NODE_ENV === 'production')
  const domain = (process.env.NODE_ENV === 'production') ? '.learnersguild.org' : req.hostname
  res.cookie('jwt', token, {domain, secure, httpOnly: true})
}

export const defaultSuccessRedirect = '/'
export const failureRedirect = '/'
