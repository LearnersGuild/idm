import test from 'ava'

test('githubProfileToUserInfo extracts correct information', t => {
  const googleProfileToUserInfo = require('../google').googleProfileToUserInfo
  const expected = {
    name: 'Me',
    email: 'me@example.com',
    emails: ['me@example.com'],
    authProviders: {
      googleOAuth2: {
        accessToken: 'abcd1234',
        refreshToken: 'wxyz9876',
      },
    },
    authProviderProfiles: {
      googleOAuth2: {displayName: 'Me'},
    },
    roles: [],
  }
  const userInfo = googleProfileToUserInfo('abcd1234', 'wxyz9876', {displayName: 'Me'}, 'me@example.com', ['me@example.com'])
  t.plan(1)
  t.same(userInfo, expected)
})
