/* eslint new-cap: [2, {"capIsNewExceptions": ["UserAuthWrapper"]}] */
import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper} from 'redux-auth-wrapper'

// TODO: use webpack code-splitting and System.import to reduce initial bundle size
import App from '../containers/App'

import BlankLayout from '../containers/BlankLayout'
import SignUp from '../containers/SignUp'
import SignIn from '../components/SignIn'

import Home from '../containers/Home'
import Profile from '../components/Profile'
import GraphiQL from '../containers/GraphiQL'

const userIsAuthenticated = UserAuthWrapper({
  failureRedirectPath: '/sign-in',
  authSelector: state => state.auth.currentUser,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'userIsAuthenticated',
})

const routes = (
  <Route path="/" component={App}>
    <Route component={BlankLayout}>
      <Route path="sign-up/:code" component={SignUp}/>
      <Route path="sign-in" component={SignIn}/>
    </Route>
    <Route component={BlankLayout}>
      <IndexRoute component={userIsAuthenticated(Home)}/>
      <Route path="profile" component={userIsAuthenticated(Profile)}/>
      <Route path="graphiql" component={userIsAuthenticated(GraphiQL)}/>
    </Route>
  </Route>
)

export default routes
