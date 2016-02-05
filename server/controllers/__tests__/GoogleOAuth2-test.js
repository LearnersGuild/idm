import test from 'ava'
import fetch from 'isomorphic-fetch'

let server

test.before.cb(t => {
  process.env.ICONS_SERVICE_TAGS_API_URL = 'https://icons.learnersguild.org/tags'
  process.env.GOOGLE_API_CLIENT_ID = '671647045935-lidv8t38k3787mjnbreedq3vad0bbl9h.apps.googleusercontent.com'
  process.env.GOOGLE_API_CLIENT_SECRET = '1xWXab7DMjkyk54qmE0uJNkU'
  process.env.PORT = '12345'
  require('../../configureCSSModules').default()
  require('../../server').start().then(theServer => {
    server = theServer
    t.end()
  })
})

test.after.cb(t => {
  server.close(t.end)
})

test('authenticate redirects to Google', t => {
  t.plan(2)
  return fetch('http://localhost:12345/auth/google', {redirect: 'manual'})
    .then(res => {
      t.is(res.status, 200)
      t.regexTest(/accounts.google.com\/ServiceLogin/, res.url)
    })
})

test('callback expects a "code" parameter', t => {
  t.plan(1)
  return fetch('http://localhost:12345/auth/google/callback')
    .then(res => {
      t.is(res.status, 401)
    })
})

test('callback should fail if "error" parameter is supplied', t => {
  t.plan(1)
  return fetch('http://localhost:12345/auth/google/callback?error=xxx&code=yyy')
    .then(res => {
      t.is(res.status, 401)
    })
})
