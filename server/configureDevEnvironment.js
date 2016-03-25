let webpack
let webpackDevMiddleware
let webpackHotMiddleware
let webpackConfig
let compiler

if (process.env.NODE_ENV === 'development') {
  // Must be require'd rather than imported since it's only a devDependency and
  // won't exist in production, and all import statements must be static.
  webpack = require('webpack')
  webpackDevMiddleware = require('webpack-dev-middleware')
  webpackHotMiddleware = require('webpack-hot-middleware')
  webpackConfig = require('../config/webpack-development-config')
  compiler = webpack(webpackConfig)
}

export default function configureAppForDevelopment(app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }))
    app.use(webpackHotMiddleware(compiler))
  }
}
