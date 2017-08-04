import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {UserAuthWrapper as userAuthWrapper} from 'redux-auth-wrapper'
import {push} from 'react-router-redux'
import {userCan} from 'src/common/util'

// TODO: use webpack code-splitting and System.import to reduce initial bundle size
import App from 'src/common/containers/App'

import BlankLayout from 'src/common/containers/BlankLayout'
import SignUp from 'src/common/containers/SignUp'
import SignIn from 'src/common/containers/SignIn'

import Home from 'src/common/containers/Home'
import Profile from 'src/common/components/Profile'
import UsersContainer from 'src/common/containers/Users'
import {buildURL} from 'src/common/util'

const userCanVisit = (capability, store) => {
  return userAuthWrapper({
    authSelector: state => state.auth.currentUser,
    predicate: currentUser => userCan(currentUser, capability),
    failureRedirectPath: '/not-found',
    allowRedirectBack: false,
    redirectAction: failureRedirectPath => {
      const {dispatch} = store
      dispatch(authorizationError('You are not authorized to do that.'))
      dispatch(push(failureRedirectPath))
      return {type: 'ignore'}
    },
    wrapperDisplayName: 'userCan',
  })
}

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
  /* global __CLIENT__, window */
  const {auth: {currentUser, lgJWT}} = store.getState()
  return (nextState, replace) => {
    const {location: {query}} = nextState
    const {redirect, responseType, SAMLRequest} = query

    if (userHasCompletedProfile(currentUser) && lgJWT) {
      if (redirect) {
        if (__CLIENT__) {
          const redirectQuery = (responseType === 'token') ? {lgJWT} : {}
          const redirectURL = buildURL(decodeURIComponent(redirect), redirectQuery)
          window.location.href = redirectURL
          return
        }
        if (redirect.match(/^\//)) {
          replace(redirect)
          return
        }
      } else if (SAMLRequest) {
        replace(buildURL('/auth/github', query))
        return
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
        <IndexRoute component={userCanVisit('viewHome', store)(Home)}/>
        <Route path="profile" component={userCanVisit('viewOwnProfile', store)(Profile)}/>
        <Route path="users" component={userCanVisit('viewAllUsers', store)(UsersContainer)}/>
      </Route>
    </Route>
  )
}

export default routes
