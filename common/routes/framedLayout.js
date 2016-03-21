import FramedLayout from '../containers/FramedLayout'

const route = {
  component: FramedLayout,
  indexRoute: require('./home'),
  childRoutes: [
    require('./graphiql'),
  ]
}

export default route
