/* eslint-disable no-undef */
import replaceComponent from './replaceComponent'
import userIsAuthenticated from './userIsAuthenticated'

const route = {
  path: 'graphiql',
}
if (__SERVER__) {
  // This is terrible. Trick CodeMirror / GraphiQL when doing SSR.
  const jsdom = require('jsdom')
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
  const win = doc.defaultView
  global.document = doc
  global.window = win
  window.localStorage = {getItem: () => null}

  const component = require('../containers/GraphiQL')
  route.component = userIsAuthenticated(component)
} else {
  route.getComponent = async (location, cb) => {
    try {
      const component = await System.import('../containers/GraphiQL')
      replaceComponent(route, userIsAuthenticated(component), cb)
    } catch (err) {
      console.error(err.stack)
    }
  }
}

export default route
