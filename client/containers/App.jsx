import React from 'react'
import { render } from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from '../../common/reducers'
import Root from '../../common/containers/Root'

const Raven = require('raven-js').noConflict()
Raven.config(window.sentryClientDSN)

const initialState = window.__INITIAL_STATE__
const store = createStore(rootReducer, initialState)

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
)
