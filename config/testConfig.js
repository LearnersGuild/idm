import path from 'path'
import jsdom from 'jsdom'

// environment setup
require('dotenv').load({path: path.join(__dirname, '..', '.env')})

// jsdom setup
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView
global.__CLIENT__ = false
global.document = doc
global.window = win
global.navigator = win.navigator

// CSS modules setup
require('../server/configureCSSModules')()
