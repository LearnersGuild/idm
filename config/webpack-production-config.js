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
    ],
    vendor: [
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
    ],
  },

  output: {
    filename: '[name].js',
    chunkFilename: 'app_[name]_[chunkhash].js',
    path: path.join(root, 'dist'),
  },

  devtool: '#cheap-module-source-map',

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    root,
  },

  plugins: [
    new ExtractTextPlugin('app.css', {allChunks: true}),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {discardComments: {removeAll: true}},
      canPrint: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
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
      // global styles that SHOULDN'T be converted into component-specific modules
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract(
        'style',
        'css?sourceMapimportLoaders=2' +
        '!sass?sourceMap' +
        '!sass-resources'
      ),
      include: [
        path.join(root, 'client', 'index.scss'),
        path.join(root, 'node_modules', 'graphiql', 'graphiql.css')
      ],
    }, {
      // component styles that SHOULD be converted into component-specific modules
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract(
        'style',
        'css?sourceMap&modules&localIdentName=[name]__[local]__[hash:base64:5]&importLoaders=2' +
        '!sass?sourceMap' +
        '!sass-resources' +
        '!toolbox'
      ),
      include: [
        path.join(root, 'node_modules', 'react-toolbox'),
        path.join(root, 'client'),
        path.join(root, 'common'),
      ],
      exclude: [
        path.join(root, 'client', 'index.scss'),
      ],
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(woff2?|ttf|eot|svg)$/,
      loaders: ['url?limit=10000'],
    }],
  },

  sassResources: './config/sass-resources.scss',
  toolbox: {theme: './common/theme.scss'},
}
