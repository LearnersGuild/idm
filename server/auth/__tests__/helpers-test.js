import test from 'ava'
import {cloneDeep, merge} from 'lodash'

import {connect} from 'src/db'
import {resetData, cleanupDB} from 'src/test/db'

import {mergeUserInfo, saveUserAvatar} from 'src/server/auth/helpers'

const r = connect()

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
  const mergedUser = Object.assign(user, mergeUserInfo(userInfo))

  t.plan(1)
  t.is(mergedUser.inviteCode, 'oakland123')
})

test.before(async () => {
  await resetData()
})

test.after(async () => {
  await cleanupDB()
})

test('saveUserAvatar: saves user\'s github avatar on sign-up', async t => {
  const jpegDataURL = 'https://www.learnersguild.org/images/LogoPrimary.png'
  const user = {
    id: '06f211e3-bd02-4fbd-b977-dc5e769ad092',
    authProviderProfiles: {
      githubOAuth2: {
        photos: [
          {
            value: jpegDataURL
          }
        ]
      }
    }
  }

  await saveUserAvatar(user)

  const userAvatar = await r.table('userAvatars')
    .filter({id: user.id})
    .nth(0)

  t.plan(4)
  t.is(userAvatar.id, user.id, 'avatar id should match user')
  t.not(userAvatar.jpegData, null, 'should insert jpeg data')
  t.not(userAvatar.createdAt, null, 'should set createdAt date')
  t.not(userAvatar.updatedAt, null, 'should set updatedAt date')
})
