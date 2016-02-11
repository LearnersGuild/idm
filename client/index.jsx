/* global window, document */
import React from 'react'
import {render} from 'react-dom'

import {Provider} from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {match, Router} from 'react-router'
import {createHistory} from 'history'
import {syncReduxAndRouter} from 'redux-simple-router'

import configureStore from '../common/store/configureStore'
import getRoutes from '../common/routes'

const Raven = require('raven-js').noConflict()
Raven.config(window.sentryClientDSN)

const initialState = window.__INITIAL_STATE__
const {pathname, search, hash} = window.location
const location = `${pathname}${search}${hash}`

const store = configureStore(initialState)
const history = createHistory()
const routes = getRoutes(store)

// for material-ui (see: https://github.com/callemall/material-ui#react-tap-event-plugin)
injectTapEventPlugin()

syncReduxAndRouter(history, store)

// Calling `match` is simply for the side-effects of loading route / component
// code for the initial location. See also: 'routes/loadRoute.js'
match({routes, location}, () => {
  render(
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('root')
  )
})
