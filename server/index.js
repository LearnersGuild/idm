/* eslint-disable no-undef */
require('babel-core/register')
require('babel-polyfill')

// These may also be defined by webpack on the client-side.
global.__CLIENT__ = false
global.__SERVER__ = true

require('./configureCSSModules')()
require('./server').start()
