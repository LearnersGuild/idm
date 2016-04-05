import test from 'ava'
import {cloneDeep, merge} from 'lodash'

test("mergeUserInfo doesn't overwrite email address", t => {
  const mergeUserInfo = require('../helpers').mergeUserInfo
  const user = {
    name: 'Me',
    email: 'me@example.com',
    emails: ['me@example.com'],
    authProviders: {
      googleOAuth2: {
        accessToken: 'abcd1234',
        refreshToken: 'wxyz9876',
        profile: {foo: 'bar'}
      },
    },
  }
  const userInfo = merge(cloneDeep(user), {email: 'me2@example.com'})
  const mergedUser = mergeUserInfo(user, userInfo)

  t.plan(1)
  t.is(mergedUser.email, 'me@example.com')
})
