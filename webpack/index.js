const path = require('path')
const config = require('src/config')

const ROOT_DIR = path.resolve(__dirname, '..')

/** entry points (bundles) */
const entry = {
  app: config.app.hotReload ? [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './client'
  ] : [
    'babel-polyfill',
    './client'
  ]
}
if (config.app.minify) {
  entry.vendor = [
    'google-libphonenumber',
    'raven-js',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-auth-wrapper',
    'redux-form',
    'redux-thunk',
  ]
}

/** output paths */
const output = {
  filename: '[name].js',
  chunkFilename: 'app_[name]_[chunkhash].js',
  path: path.join(ROOT_DIR, 'dist'),
}

/** source maps */
const devtool = config.app.minify ?
  '#cheap-module-source-map' :
  '#cheap-module-eval-source-map'

/** resolving module paths */
const resolve = {
  extensions: ['.js', '.jsx', '.scss'],
  modules: [ROOT_DIR, 'node_modules'],
}

module.exports = {
  entry,
  output,
  devtool,
  resolve,
  plugins: require('./plugins')({config}),
  module: require('./module')({config, root: ROOT_DIR}),
  context: ROOT_DIR,
}
