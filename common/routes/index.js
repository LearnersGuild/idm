import Root from '../containers/Root'

export default function getRoutes(store) {
  return {
    component: Root,
    onEnter: (nextState, replace) => {
      const {auth} = store.getState()
      if (!auth.currentUser || !auth.currentUser.idToken) {
        if (nextState.location.pathname !== '/sign-in') {
          replace('/sign-in')
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
