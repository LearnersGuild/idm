/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'

const route = {}
if (__SERVER__) {
  route.component = require('../components/Home')
} else {
  route.getComponent = async (location, cb) => {
    const component = await System.import('../components/Home')
    replaceComponent(route, component, cb)
  }
}

export default route
