import Root from '../containers/Root'

export default function getRoutes(/* store */) {
  return {
    component: Root,
    path: '/',
    indexRoute: require('./home'),
    childRoutes: [
      require('./signUp'),
    ]
  }
}
