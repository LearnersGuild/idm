/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {
  path: 'sign-up',
}
if (__SERVER__) {
  route.component = require('../components/SignUp')
} else {
  route.getComponent = async (location, cb) => {
    try {
      const component = await System.import('../components/SignUp')
      replaceComponent(route, component, cb)
    } catch (err) {
      console.error(err.stack)
    }
  }
}

export default route
