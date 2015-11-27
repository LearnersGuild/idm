/* eslint-disable no-undef */

jest.dontMock('../Root')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

const Root = require('../Root')

describe('Root', () => {
  // This is admittedly a stupid test, but it's here just to demonstrate
  // best practices around testing.
  it('links to the API docs', () => {
    const root = TestUtils.renderIntoDocument(
      <Root />
    )
    const rootNode = ReactDOM.findDOMNode(root)

    expect(rootNode.textContent).toContain('View API Docs')
  })
})
