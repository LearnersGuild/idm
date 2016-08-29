import test from 'ava'

import {buildURL} from 'src/common/util/index'

test('buildURL properly builds URL w/o query params', t => {
  const baseURL = 'http://www.foo.com'
  const url = buildURL(baseURL)
  t.is(url, baseURL)
})

test('baseURL properly builds URL with query params', t => {
  const baseURL = 'http://www.foo.com'
  const params = {blergh: 'hm', blargh: 'ok'}
  const url = buildURL(baseURL, params)
  t.is(url, `${baseURL}?blergh=hm&blargh=ok`)
})
