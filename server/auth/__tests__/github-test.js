import test from 'ava'

test('githubProfileToUserInfo extracts correct information', t => {
  const githubProfileToUserInfo = require('../github').githubProfileToUserInfo
  const expected = {
    name: 'Me',
    email: 'me@example.com',
    emails: ['me@example.com'],
    handle: 'me',
    authProviders: {
      githubOAuth2: {
        accessToken: 'abcd1234',
        refreshToken: 'wxyz9876',
        profile: {displayName: 'Me', username: 'me'},
      },
    },
    roles: [],
  }
  const userInfo = githubProfileToUserInfo('abcd1234', 'wxyz9876', {displayName: 'Me', username: 'me'}, 'me@example.com', ['me@example.com'])
  t.plan(1)
  t.same(userInfo, expected)
})
