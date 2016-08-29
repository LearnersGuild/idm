import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {routerActions} from 'react-router-redux'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'

// TODO: use webpack code-splitting and System.import to reduce initial bundle size
import App from 'src/common/containers/App'

import BlankLayout from 'src/common/containers/BlankLayout'
import SignUp from 'src/common/containers/SignUp'
import SignIn from 'src/common/containers/SignIn'

import Home from 'src/common/containers/Home'
import Profile from 'src/common/components/Profile'
import {buildURL} from 'src/common/util'

const userIsAuthenticated = userAuthWrapper({
  failureRedirectPath: '/sign-in',
  authSelector: state => state.auth.currentUser,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'userIsAuthenticated',
})

function userHasCompletedProfile(currentUser) {
  return (
    currentUser &&
    currentUser.email &&
    currentUser.handle &&
    currentUser.name &&
    currentUser.phone &&
    currentUser.dateOfBirth &&
    currentUser.timezone
  )
}

function redirectIfSignedIn(store) {
  /* global __CLIENT__, __SERVER__, window */
  const {auth: {currentUser, lgJWT}} = store.getState()
  return (nextState, replace) => {
    const {location: {query}} = nextState
    if (userHasCompletedProfile(currentUser) && lgJWT) {
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
          const redirectURL = buildURL(decodeURIComponent(redirect), redirectQuery)
          window.location.href = redirectURL
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
