/* eslint-disable no-undef */

import jwt from 'jsonwebtoken'
import passport from 'passport'
import fetch from 'node-fetch'
import _ from 'lodash'
import r from 'rethinkdb'
import raven from 'raven'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import getDBConfig from '../../db/config'
import { renderFullPage } from '../render'
import Root from '../../common/containers/Root'


const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export function updateUser(accessToken, refreshToken, profile, done) {
  const userData = {
    name: profile.displayName,
    email: profile.emails[0].value,
    google_auth_info: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile,
    },
  }
  // find the user by her email address, then insert / update
  r.connect(getDBConfig())
    .then((conn) => {
      return r.table('users')
        .filter({ email: userData.email })
        .run(conn)
        .then((cursor) => cursor.toArray())
        .then((users) => {
          const user = users.length ? users[0] : {}
          return _.merge(user, userData)
        })
        .then((user) => {
          return r.table('users')
            .insert(user, { returnChanges: true, conflict: 'update' })
            .run(conn)
            .then((result) => result.changes[0].new_val)
            .then((updatedUser) => {
              return done(null, updatedUser)
            })
        })
    })
    .catch((err) => {
      sentry.captureException(err)
      return done("Couldn't save user record.")
    })
}

export function authenticate(req, res, next) {
  const scopes = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
  ]

  passport.authenticate('google', { scope: scopes, accessType: 'offline'})(req, res, next)
}

// TODO: any way to refactor this with what's in ../render.js?
export function callback(req, res, next) {
  if (!req.query.code || req.query.error) {
    const errStr = req.query.error ? req.query.error : "Missing 'code' parameter."
    return res.status(401).send(`<html><body><h1>401 Unauthorized</h1><p>${errStr}</p></body></html>`)
  }

  passport.authenticate(
    'google', {},
    (err, user) => {
      if (err) {
        sentry.captureException(new Error(err))
        return res.status(401).send(`<html><body><h1>401 Unauthorized</h1><p>${err}</p></body></html>`)
      }

      const token = jwt.sign({
        iss: 'learnersguild.org',
        sub: user.id,
        name: user.name,
      }, process.env.JWT_SECRET)
      const initialState = { token, user, title: 'Identity Management' }
      const renderedAppHtml = ReactDOMServer.renderToString(
        <Root />
      )
      fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
        .then((resp) => {
          return resp.json()
        }).then((tags) => {
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
          res.send(renderFullPage(tags.join('\n        '), renderedAppHtml, initialState))
        })
    }
  )(req, res, next)
}
