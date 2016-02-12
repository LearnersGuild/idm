/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {
  path: 'sign-up',
}
if (__SERVER__) {
  route.component = require('../components/SignUpForm')
} else {
  route.getComponent = async (location, cb) => {
    const component = await System.import('../components/SignUpForm')
    replaceComponent(route, component, cb)
  }
}

export default route
