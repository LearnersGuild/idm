/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {
  path: 'sign-in',
}
if (__SERVER__) {
  route.component = require('../components/SignIn')
} else {
  route.getComponent = async (location, cb) => {
    const component = await System.import('../components/SignIn')
    replaceComponent(route, component, cb)
  }
}

export default route
