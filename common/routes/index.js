import App from '../containers/App'

export default function getRoutes(/* store */) {
  return {
    component: App,
    path: '/',
    childRoutes: [
      require('./signedIn'),
      require('./notSignedIn'),
    ]
  }
}
