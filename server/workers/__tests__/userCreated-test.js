import test from 'ava'
import * as userCreated from '../userCreated'

test('syncs newly created user with CRM and sends user data to echo.', t => {
  t.true(userCreated.hasOwnProperty('start'))
  t.true(userCreated.hasOwnProperty('processUserCreated'))
})
