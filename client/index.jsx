/* global window, document */
import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {match, browserHistory, Router} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import configureStore from '../common/store/configureStore'
import getRoutes from '../common/routes'

import './index.scss'

const Raven = require('raven-js').noConflict()
if (window.sentryClientDSN) {
  Raven.config(window.sentryClientDSN)
}

const initialState = window.__INITIAL_STATE__ || {}

const {pathname, search, hash} = window.location
const location = `${pathname}${search}${hash}`

const store = configureStore(initialState)
const routes = getRoutes(store)

// for material-ui (see: https://github.com/callemall/material-ui#react-tap-event-plugin)
injectTapEventPlugin()

syncHistoryWithStore(browserHistory, store)

// Calling `match` is simply for the side-effects of loading route / component
// code for the initial location. See also: 'routes/loadRoute.js'
match({routes, location}, () => {
  render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('root')
  )
})
