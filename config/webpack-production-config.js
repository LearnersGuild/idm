const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')

const root = path.join(__dirname, '..')

module.exports = {
  context: root,

  entry: {
    app: [
      'babel-polyfill',
      './client',
    ]
  },

  output: {
    filename: 'app.js',
    chunkFilename: 'app_[name]_[chunkhash].js',
    path: path.join(root, 'dist'),
  },

  devtool: '#cheap-module-source-map',

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root,
  },

  plugins: [
    new ExtractTextPlugin('app.css', {allChunks: true}),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {discardComments: {removeAll: true}},
      canPrint: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production'),
      },
      '__CLIENT__': true,
      '__SERVER__': false,
      '__DEVTOOLS__': false  // <-------- DISABLE redux-devtools HERE
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ],

  module: {
    loaders: [{
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
        ),
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]' +
          '!sass?sourceMap' +
          '!sass-resources'
        ),
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loaders: ['url?limit=10000'],
      }, {
        test: /node_modules\/auth0-lock\/.*\.js$/,
        loaders: [
          'transform-loader/cacheable?brfs',
          'transform-loader/cacheable?packageify'
        ]
      }, {
        test: /node_modules\/auth0-lock\/.*\.ejs$/,
        loader: 'transform-loader/cacheable?ejsify'
      },
    ],
  },

  sassResources: './config/sass-resources.scss',
}
