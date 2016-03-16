import test from 'ava'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

test('App shows app title', t => {
  // This is admittedly a stupid test, but it's here just to demonstrate
  // best practices around testing.
  t.plan(1)

  const App = require('../App').App
  const root = TestUtils.renderIntoDocument(
    React.createElement(App)
  )
  const rootNode = ReactDOM.findDOMNode(root)

  t.regex(rootNode.textContent, /Identity Management/)
})
