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

test('addRolesDeducibleFromEmails adds staff role for users with LG email address', t => {
  const addRolesDeducibleFromEmails = require('../helpers').addRolesDeducibleFromEmails
  const userInfo = {
    name: 'Ivanna Learntocode',
    email: 'ivanna@learnersguild.org',
    emails: ['ivanna@learnersguild.org'],
  }

  t.plan(1)
  t.same(addRolesDeducibleFromEmails(userInfo).roles, ['backoffice'])
})

test('addRolesDeducibleFromEmails does not add staff role for non-LG users', t => {
  const addRolesDeducibleFromEmails = require('../helpers').addRolesDeducibleFromEmails
  const userInfo = {
    name: 'Anita Neujob',
    email: 'anita@example.com',
    emails: ['anita@example.com'],
  }

  t.plan(1)
  t.same(addRolesDeducibleFromEmails(userInfo).roles, [])
})
