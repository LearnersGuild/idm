import {merge} from 'lodash'
import jwt from 'jsonwebtoken'

import r from '../../db/connect'

export function mergeUserInfo(user, userInfo) {
  // don't overwrite primary email address
  return merge(user, userInfo, {email: user.email})
}

export function createOrUpdateUser(user, userInfo) {
  const timestamps = {updatedAt: r.now()}
  if (user) {
    return r.table('users').update(mergeUserInfo(user, userInfo), {returnChanges: true}).run()
  }
  timestamps.createdAt = r.now()
  return r.table('users').insert(userInfo, {returnChanges: true}).run()
}

export function getUsersForEmails(emails) {
  return r.table('users').getAll(...emails, {index: 'emails'}).distinct().run()
}

export function getUserById(id) {
  return r.table('users')
    .get(id)
    .do(user => {
      return r.branch(
        user.ne(null),
        user.pluck('id', 'email', 'emails', 'handle', 'name', 'phone', 'dateOfBirth', 'timezone', 'roles', 'authProviders'),
        null
      )
    })
    .run()
}

export function setJWTCookie(req, res) {
  const token = jwt.sign({iss: 'idm.learnersguild.org', sub: req.user.id}, process.env.SHARED_JWT_SECRET)
  const secure = (process.env.NODE_ENV === 'production')
  const domain = (process.env.NODE_ENV === 'production') ? '.learnersguild.org' : req.hostname
  res.cookie('jwt', token, {domain, secure, httpOnly: true})
}

export function clearJWTCookie(req, res) {
  const secure = (process.env.NODE_ENV === 'production')
  const domain = (process.env.NODE_ENV === 'production') ? '.learnersguild.org' : req.hostname
  res.clearCookie('jwt', {domain, secure, httpOnly: true})
}

export function addRolesDeducibleFromEmails(userInfo) {
  const rolesToAdd = userInfo.emails.reduce((rolesSoFar, email) => {
    if (email.match(/learnersguild\.org/)) {
      rolesSoFar.push('staff')
    }
    return rolesSoFar
  }, [])
  userInfo.roles = userInfo.roles || []
  userInfo.roles = userInfo.roles.concat(rolesToAdd)
  return userInfo
}

export const defaultSuccessRedirect = '/'
