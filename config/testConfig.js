/* eslint-disable no-var */
var jsdom = require('jsdom')

// jsdom setup
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
var win = doc.defaultView

global.__CLIENT__ = false
global.__SERVER__ = true
global.document = doc
global.window = win
global.navigator = win.navigator

// CSS modules setup
require('src/server/configureCSSModules')()

// use one database per-process b/c ava runs tests in parallel
global.dbConfig = require('src/test/db').configureDB()
