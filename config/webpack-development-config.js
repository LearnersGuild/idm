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
    loaders: [
      {
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
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
        ],
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
          'sass?sourceMap',
          'sass-resources',
        ],
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loaders: ['url?limit=10000'],
      },
    ],
  },

  sassResources: './config/sass-resources.scss',
}
