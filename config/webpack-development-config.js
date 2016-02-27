const webpack = require('webpack')
const path = require('path')

const root = path.join(__dirname, '..')

module.exports = {

  entry: {
    app: [
      'babel-polyfill',
      'webpack-hot-middleware/client',
      './client',
    ]
  },

  output: {
    filename: 'app.js',
    chunkFilename: 'app_[name]_[chunkhash].js',
    path: path.join(root, 'dist'),
  },

  // devtool: '#source-map',
  devtool: '#cheap-module-eval-source-map',

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        plugins: [
          ['react-transform', {
            transforms: [{
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module'],
            }]
          }]
        ],
      },
    }, {
      // global styles that SHOULDN'T be converted into component-specific modules
      test: /.s?css$/,
      loaders: [
        'style',
        'css?sourceMap&importLoaders=2',
        'sass?sourceMap',
        'sass-resources',
      ],
      include: [
        path.join(root, 'client', 'index.scss'),
        path.join(root, 'node_modules', 'graphiql', 'graphiql.css')
      ],
    }, {
      // component styles that SHOULD be converted into component-specific modules
      test: /\.s?css$/,
      loaders: [
        'style',
        'css?sourceMap&modules&localIdentName=[name]__[local]__[hash:base64:5]&importLoaders=2',
        'sass?sourceMap',
        'sass-resources',
      ],
      include: [
        path.join(root, 'client'),
        path.join(root, 'common'),
      ],
      exclude: [
        path.join(root, 'client', 'index.scss'),
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(woff2?|ttf|eot|svg)$/,
      loaders: ['url?limit=10000'],
    }],
  },

  sassResources: './config/sass-resources.scss',
}
