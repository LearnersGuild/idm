import jsdom from 'jsdom'

// environment setup
process.env.RETHINKDB_URL = 'rethinkdb://localhost:28015/idm_test'

// jsdom setup
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView
global.__CLIENT__ = false
global.document = doc
global.window = win
global.navigator = win.navigator

// CSS modules setup
require('../server/configureCSSModules')()
