import {merge} from 'lodash'
import jwt from 'jsonwebtoken'

import r from '../../db/connect'

export const defaultSuccessRedirect = '/'
export const jwtIssuer = 'learnersguild.org'

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

export function jwtClaimsForUser(user) {
  /* eslint-disable camelcase */
  const now = Math.floor(Date.now() / 1000)
  return {
    iss: jwtIssuer,
    iat: now,
    exp: now + (60 * 60 * 24),  // 1 day from now
    sub: user.id,
    name: user.name,
    preferred_username: user.handle,
    email: user.email,
    emails: user.emails.join(','),
    birthdate: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : undefined,
    zoneinfo: user.timezone,
    phone_number: user.phone,
    roles: user.roles.join(','),
  }
}

export function userFromJWTClaims(jwtClaims) {
  return {
    id: jwtClaims.sub,
    name: jwtClaims.name,
    handle: jwtClaims.preferred_username,
    email: jwtClaims.email,
    emails: jwtClaims.emails.split(','),
    dateOfBirth: jwtClaims.birthdate ? new Date(jwtClaims.birthdate) : undefined,
    timezone: jwtClaims.zoneinfo,
    phone: jwtClaims.phone_number,
    roles: jwtClaims.roles.split(','),
  }
}

function userFromJWT(lgJWT) {
  const jwtClaims = jwt.verify(lgJWT, process.env.SHARED_JWT_SECRET, {issuer: jwtIssuer})
  return userFromJWTClaims(jwtClaims)
}

export function cookieOptsJWT(req) {
  const secure = (process.env.NODE_ENV === 'production')
  const domain = (process.env.NODE_ENV === 'production') ? '.learnersguild.org' : req.hostname
  return {secure, domain, httpOnly: true}
}

export function slideJWTSession(req, res, next) {
  try {
    if (!req.user || !req.user.lgJWT) {
      const authHeaderRegex = /^Bearer\s([A-Za-z0-9+\/_\-\.]+)$/
      const authHeader = req.get('Authorization')
      if (authHeader) {
        req.user = userFromJWT(authHeader.match(authHeaderRegex)[1])
      } else if (req.cookies && req.cookies.lgJWT) {
        req.user = userFromJWT(req.cookies.lgJWT)
      }
    }
    if (req.user) {
      const jwtClaims = jwtClaimsForUser(req.user)
      const expires = new Date(jwtClaims.exp * 1000)
      const token = jwt.sign(jwtClaims, process.env.SHARED_JWT_SECRET)
      req.lgJWT = token
      res.set('LearnersGuild-JWT', token)
      res.cookie('lgJWT', token, Object.assign(cookieOptsJWT(req), {expires}))
    }
  } catch (err) {
    console.info('Invalid JWT:', err.message ? err.message : err)
    res.clearCookie('lgJWT', cookieOptsJWT(req))
    req.lgJWT = null
  }
  if (next) {
    next()
  }
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
