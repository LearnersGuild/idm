/* eslint-disable no-undef */

// This is terribly ugly, but seems to be the cleanest way I could find to
// asynchronously load routes to support code splitting in the browser. The
// loadRoute function is different depending on whether the route is being
// loaded on the server (in which case a simple 'require' is used) or in
// the browser (in which case it uses webpack 2.x's 'System.import').

function getComponent(route) {
  return async (location, cb) => {
    const component = await System.import('../components/Example')
    // That's right. We're actually wholesale replacing the asynchronous-
    // loading getComponent function with the actual component. UGLY.
    // But it works.
    route.component = component
    delete route.getComponent
    cb(null, component)
  }
}

const route = {
  path: 'example',
}
if (__SERVER__) {
  route.component = require('../components/Example')
} else {
  route.getComponent = getComponent(route)
}

export default route
