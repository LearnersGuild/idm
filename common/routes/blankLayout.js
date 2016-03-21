import BlankLayout from '../containers/BlankLayout'

const route = {
  component: BlankLayout,
  childRoutes: [
    require('./signIn'),
    require('./signUp'),
  ]
}

export default route
