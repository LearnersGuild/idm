const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    app: [
      'bootstrap-loader/extractStyles',
      './common/containers/App.jsx',
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'app.js',
  },

  resolve: { extensions: [ '', '.js', '.jsx' ] },

  plugins: [
    new ExtractTextPlugin('app.css', { allChunks: true }),
    new webpack.DefinePlugin({
      'process.env': {
        // useful to reduce the size of client-side libraries, e.g. react
        'NODE_ENV': JSON.stringify('production'),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
        ),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]' +
          '!sass'
        ),
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loaders: [ 'url?limit=10000' ],
      },
    ],
  },
}
