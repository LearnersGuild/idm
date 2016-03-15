/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {
  path: 'sign-in',
}
if (__SERVER__) {
  route.component = require('../components/SignIn')
} else {
  route.getComponent = async (location, cb) => {
    try {
      const component = await System.import('../components/SignIn')
      replaceComponent(route, component, cb)
    } catch (err) {
      console.error(err.stack)
    }
  }
}

export default route
