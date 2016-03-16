import SignedIn from '../containers/SignedIn'

const route = {
  component: SignedIn,
  indexRoute: require('./home'),
  childRoutes: [
    require('./graphiql'),
  ]
}

export default route
