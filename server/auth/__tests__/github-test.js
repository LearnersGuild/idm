import test from 'ava'

test('githubProfileToUserInfo extracts correct information', t => {
  const githubProfileToUserInfo = require('src/server/auth/github').githubProfileToUserInfo

  const expected = {
    name: 'Me',
    email: 'me@example.com',
    emails: ['me@example.com'],
    handle: 'me',
    inviteCode: 'abcd1234',
    roles: ['abcd1234'],
    authProviders: {
      githubOAuth2: {
        accessToken: 'abcd1234',
        refreshToken: 'wxyz9876',
      },
    },
    authProviderProfiles: {
      githubOAuth2: {displayName: 'Me', username: 'me'},
    },
  }
  const inviteCode = {
    id: 'abcd1234',
    code: 'abcd1234',
    description: 'abcd1234',
    roles: ['abcd1234']
  }
  const userInfo = githubProfileToUserInfo('abcd1234', 'wxyz9876', {displayName: 'Me', username: 'me'}, 'me@example.com', ['me@example.com'], inviteCode)
  t.plan(1)
  t.deepEqual(userInfo, expected)
})
