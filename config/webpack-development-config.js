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
    extensions: ['', '.js', '.jsx', '.scss'],
    root,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
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
      // global styles
      test: /Root\.css$/,
      loaders: [
        'style',
        'css?sourceMap',
      ],
    }, {
      // react-toolbox
      test: /\.scss$/,
      loaders: [
        'style',
        'css?modules&localIdentName=[name]__[local]__[hash:base64:5]&importLoaders=2',
        'sass',
        'toolbox',
      ],
      include: [
        path.resolve(root, 'node_modules', 'react-toolbox'),
      ],
    }, {
      // app sass styles
      test: /\.scss$/,
      loaders: [
        'style',
        'css?modules&localIdentName=[name]__[local]__[hash:base64:5]&importLoaders=2',
        'sass?sourceMap',
        'sass-resources',
      ],
      include: [
        path.resolve(root, 'common'),
      ],
    }, {
      // app css styles
      test: /\.css$/,
      loaders: [
        'style',
        'css?sourceMap&modules&localIdentName=[name]__[local]__[hash:base64:5]&importLoaders=2',
      ],
      include: [
        path.resolve(root, 'common'),
      ],
      exclude: [
        path.resolve(root, 'common', 'containers', 'Root.css'),
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
  toolbox: {theme: './common/theme.scss'},
}
