/* eslint-disable no-undef */

import replaceComponent from './replaceComponent'
import userIsAuthenticated from './userIsAuthenticated'

const route = {}
if (__SERVER__) {
  const component = require('../components/Home')
  route.component = userIsAuthenticated(component)
} else {
  route.getComponent = async (location, cb) => {
    const component = await System.import('../components/Home')
    replaceComponent(route, userIsAuthenticated(component), cb)
  }
}

export default route
