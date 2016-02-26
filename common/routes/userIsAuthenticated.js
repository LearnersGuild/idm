/* eslint new-cap: [2, {"capIsNewExceptions": ["UserAuthWrapper"]}] */

import {routerActions} from 'react-router-redux'
import {UserAuthWrapper} from 'redux-auth-wrapper'

export default UserAuthWrapper({
  failureRedirectPath: '/sign-in',
  authSelector: state => state.auth.currentUser,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'userIsAuthenticated',
})
