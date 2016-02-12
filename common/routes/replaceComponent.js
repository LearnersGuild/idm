// This is terribly ugly, but seems to be the cleanest way I could find to
// asynchronously load routes to support code splitting in the browser.
//
// If the route is being loaded on the server, we use a simple 'require' and
// attach to the component attirbute. But if the route is being loaded in the
// browser, we use webpack 2.x's 'System.import', then call this function.

export default function replaceComponent(route, component, cb) {
  // That's right. We're actually wholesale replacing the asynchronous-
  // loading getComponent function with the actual component. UGLY.
  // But it works.
  route.component = component
  delete route.getComponent
  cb(null, component)
}
