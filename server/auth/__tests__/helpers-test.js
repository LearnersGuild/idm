import test from 'ava'
import {cloneDeep, merge} from 'lodash'

import {mergeUserInfo} from 'src/server/auth/helpers'

test('mergeUserInfo doesn\'t overwrite email address', t => {
  const user = {
    name: 'Me',
    email: 'me@example.com',
    emails: ['me@example.com'],
    inviteCode: 'oakland123',
    authProviders: {
      googleOAuth2: {
        accessToken: 'abcd1234',
        refreshToken: 'wxyz9876',
        profile: {foo: 'bar'}
      },
    },
  }
  const userInfo = merge(cloneDeep(user), {inviteCode: 'DIFFERENT VALUE'})
  const mergedUser = mergeUserInfo(user, userInfo)

  t.plan(1)
  t.is(mergedUser.inviteCode, 'oakland123')
})
