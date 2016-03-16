import NotSignedIn from '../containers/NotSignedIn'

const route = {
  component: NotSignedIn,
  childRoutes: [
    require('./signIn'),
    require('./signUp'),
  ]
}

export default route
