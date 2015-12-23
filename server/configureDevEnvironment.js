/* eslint-disable no-undef */
export default function configureAppForDevelopment(app) {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV === 'development') {
      // Must be require'd rather than imported since it's only a devDependency and
      // won't exist in production, and all import statements must be static.
      const webpack = require('webpack')
      const webpackDevMiddleware = require('webpack-dev-middleware')
      const webpackHotMiddleware = require('webpack-hot-middleware')
      const webpackConfig = require('../config/webpack-development-config')
      const compiler = webpack(webpackConfig)
      app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
      }))
      app.use(webpackHotMiddleware(compiler))

      return resolve()
    }
  })
}
