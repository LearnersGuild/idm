import App from '../containers/App'

export default function getRoutes(/* store */) {
  return {
    component: App,
    path: '/',
    indexRoute: require('./home'),
    childRoutes: [
      require('./graphiql'),
      require('./signIn'),
      require('./signUp'),
    ]
  }
}
