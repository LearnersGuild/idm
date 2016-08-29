/* eslint-disable no-undef */
require('babel-core/register')
require('babel-polyfill')

const config = require('src/config')

if (config.server.newrelic.enabled) {
  require('newrelic')
}

// These may also be defined by webpack on the client-side.
global.__CLIENT__ = false
global.__SERVER__ = true

require('./configureCSSModules')()
require('./server').start()
