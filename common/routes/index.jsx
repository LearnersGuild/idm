import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'

// TODO: use webpack code-splitting and System.import to reduce initial bundle size
import App from '../containers/App'

import BlankLayout from '../containers/BlankLayout'
import SignUp from '../containers/SignUp'
import SignIn from '../components/SignIn'

import Home from '../containers/Home'
import Profile from '../components/Profile'
import {buildURL} from '../util'

const userIsAuthenticated = userAuthWrapper({
  failureRedirectPath: '/sign-in',
  authSelector: state => state.auth.currentUser,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'userIsAuthenticated',
})

function redirectIfSignedIn(store) {
  /* global __CLIENT__, __SERVER__, window */
  const {auth: {currentUser, lgJWT}} = store.getState()
  return (nextState, replace) => {
    const {location: {query}} = nextState
    if (currentUser && lgJWT) {
      const {redirect, responseType} = query
      if (__SERVER__ && !redirect) {
        return replace('/')
      }
      if (redirect) {
        if (redirect.match(/^\//)) {
          return replace(redirect)
        }
        if (__CLIENT__) {
          const redirectQuery = (responseType === 'token') ? {lgJWT} : {}
          const redirectURL = buildURL(redirect, redirectQuery)
          window.location.href = redirectURL
          return replace(redirectURL)
        }
      }
    }
  }
}

const routes = store => {
  return (
    <Route path="/" component={App}>
      <Route component={BlankLayout}>
        <Route path="sign-up" component={SignUp} onEnter={redirectIfSignedIn(store)}/>
        <Route path="sign-up/:code" component={SignUp} onEnter={redirectIfSignedIn(store)}/>
        <Route path="sign-in" component={SignIn} onEnter={redirectIfSignedIn(store)}/>
      </Route>
      <Route component={BlankLayout}>
        <IndexRoute component={userIsAuthenticated(Home)}/>
        <Route path="profile" component={userIsAuthenticated(Profile)}/>
      </Route>
    </Route>
  )
}

export default routes
