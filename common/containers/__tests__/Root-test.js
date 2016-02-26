import test from 'ava'
import jsdom from 'jsdom'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

test.before(() => {
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
  const win = doc.defaultView
  global.__CLIENT__ = false
  global.document = doc
  global.window = win
  require('../../../server/configureCSSModules')()
})

test('Root links to the API docs', t => {
  // This is admittedly a stupid test, but it's here just to demonstrate
  // best practices around testing.
  t.plan(1)

  const Root = require('../Root').Root
  const root = TestUtils.renderIntoDocument(
    React.createElement(Root)
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.regex(rootNode.textContent, /View GraphiQL/)
})
