import Root from '../containers/Root'

export default function getRoutes(store) {
  return {
    component: Root,
    onEnter: (nextState, replaceState) => {
      const {auth} = store.getState()
      if (!auth.currentUser || !auth.currentUser.idToken) {
        if (nextState.location.pathname !== '/sign-in') {
          replaceState(null, '/sign-in')
        }
      }
    },
    path: '/',
    indexRoute: require('./home'),
    childRoutes: [
      require('./signIn'),
      require('./signUp'),
    ]
  }
}
