import test from 'ava'
import {useFixture} from 'src/test/fixtures'

import createMember from '../createMember'

test.beforeEach(() => {
  useFixture.nockClean()
  useFixture.nockEchoCreateMember('fake_id', 'fake_chapterId')
})

test('createMember calls the Echo API and returns true when successful.', async t => {
  t.true(typeof createMember === 'function', 'createMember is not a function.')

  const success = await createMember('test_id', 'test_inviteCode')
  t.truthy(success, 'createMember did not return true.')
})

test.after(useFixture.nockClean)
