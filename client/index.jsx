/* global window, document */
import React from 'react'
import {render} from 'react-dom'
import {browserHistory, Router} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import configureStore from 'src/common/store/configureStore'
import Root from 'src/common/containers/Root'
import routes from 'src/common/routes'

const Raven = require('raven-js').noConflict()

if (window.sentryClientDSN) {
  Raven.config(window.sentryClientDSN)
}

const initialState = window.__INITIAL_STATE__ || {}
const store = configureStore(initialState)

syncHistoryWithStore(browserHistory, store)

render(
  <Root store={store}>
    <Router history={browserHistory}>
      {routes(store)}
    </Router>
  </Root>,
  document.getElementById('root')
)
