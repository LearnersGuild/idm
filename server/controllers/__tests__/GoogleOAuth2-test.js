/* eslint-disable no-undef */

jest.dontMock('../GoogleOAuth2')


describe('GoogleOAuth2', () => {
  let request
  let app
  beforeEach(() => {
    delete global.window // disable jsdom
    process.env.PORT = '12345'
    process.env.GOOGLE_API_CLIENT_ID = 'ignore'
    process.env.GOOGLE_API_CLIENT_SECRET = 'ignore'
    jest.autoMockOff()
    request = require('supertest')
    app = require('../../server')
  })
  afterEach(() => {
    app.close()
    jest.autoMockOn()
  })

  describe('authenticate', () => {
    it('redirects to Google', () => {
      let requestSucceeded = false

      runs(() => {
        request(app)
          .get('/auth/google')
          .expect('Location', /accounts\.google\.com\/o\/oauth2/)
          .expect(302, (err) => {
            if (err) {
              requestSucceeded = false
            } else {
              requestSucceeded = true
            }
          })
      })

      waitsFor(() => {
        return requestSucceeded
      }, 'Request did not redirect to Google as expected.', 1500)
    })
  })

  describe('callback', () => {
    it('expects a \'code\' parameter', () => {
      let requestSucceeded = false

      runs(() => {
        request(app)
          .get('/auth/google/callback')
          .expect(400, (err) => {
            if (err) {
              requestSucceeded = false
            } else {
              requestSucceeded = true
            }
          })
      })

      waitsFor(() => {
        return requestSucceeded
      }, 'Request should be recognized as malformed.', 1500)
    })

    it('should succeed if code parameter is supplied', () => {
      let requestSucceeded = false

      runs(() => {
        request(app)
          .get('/auth/google/callback')
          .query({ code: 'xxx' })
          .expect(200, (err) => {
            if (err) {
              requestSucceeded = false
            } else {
              requestSucceeded = true
            }
          })
      })

      waitsFor(() => {
        return requestSucceeded
      }, 'Request should be accepted.', 1500)
    })
  })
})
