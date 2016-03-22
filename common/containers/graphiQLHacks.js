/* global __SERVER__ */
if (__SERVER__) {
  // This is terrible. GraphiQL requires this.
  const doc = require('jsdom').jsdom('<!doctype html><html><body></body></html>')
  const win = doc.defaultView
  win.localStorage = {
    getItem: () => null,
    setItem: () => null,
  }
  global.document = doc
  global.window = win
  global.navigator = win.navigator
}
