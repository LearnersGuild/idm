import React from 'react'
import ReactDOM from 'react-dom'

import Root from '../../common/containers/Root'

const Raven = require('raven-js').noConflict()
const initialState = window.__INITIAL_STATE__
Raven.config(initialState.sentryClientDSN)

Raven.captureException(new Error('this is a client-side test'))


ReactDOM.render(<Root />, document.getElementById('root'))
