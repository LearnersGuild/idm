import React from 'react'
import { Route } from 'react-router'

import Root from './containers/Root'

export default function getRoutes(/* store */) {
  return (
    <Route path="/" component={Root}>
      <Route path="example" component={Root} />
    </Route>
  )
}
