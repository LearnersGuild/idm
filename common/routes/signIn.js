/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {
  path: 'sign-in',
}
if (__SERVER__) {
  route.component = require('../containers/SignIn')
} else {
  route.getComponent = async (location, cb) => {
    const component = await System.import('../containers/SignIn')
    replaceComponent(route, component, cb)
  }
}

export default route
