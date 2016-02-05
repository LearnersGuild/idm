/* eslint-disable no-undef */

jest.dontMock('../GoogleOAuth2')

describe('GoogleOAuth2', () => {
  let request
  let server
  beforeAll(done => {
    delete global.window // disable jsdom
    process.env.PORT = '12345'
    process.env.GOOGLE_API_CLIENT_ID = 'ignore'
    process.env.GOOGLE_API_CLIENT_SECRET = 'ignore'
    jest.autoMockOff()
    request = require('supertest')
    require('../../server').start().then(theServer => {
      server = theServer
      done()
    })
  })
  afterAll(done => {
    jest.autoMockOn()
    server.close(done)
  })

  describe('authenticate', () => {
    it('redirects to Google', done => {
      request(server)
        .get('/auth/google')
        .expect('Location', /accounts\.google\.com\/o\/oauth2/)
        .expect(302, err => {
          if (err) {
            return done.fail(err)
          }
          return done()
        })
    })
  })

  describe('callback', () => {
    it('expects a \'code\' parameter', done => {
      request(server)
        .get('/auth/google/callback')
        .expect(401, err => {
          if (err) {
            return done.fail(err)
          }
          return done()
        })
    })

    it('should fail if \'error\' parameter is supplied', done => {
      request(server)
        .get('/auth/google/callback')
        .query({error: 'xxx', code: 'yyy'})
        .expect(401, err => {
          if (err) {
            return done.fail(err)
          }
          return done()
        })
    })
  })
})
