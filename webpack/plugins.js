const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackFailPlugin = require('webpack-fail-plugin')

module.exports = ({config}) => {
  const plugins = [
    WebpackFailPlugin,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_BASE_URL: JSON.stringify(config.app.baseURL),
        GRAPHIQL_BASE_URL: JSON.stringify(config.graphiql.baseURL),
      },
      '__CLIENT__': true,
      '__SERVER__': false,
    }),
  ]

  if (config.app.hotReload) {
    plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    )
  }

  if (config.app.noErrors) {
    plugins.push(new webpack.NoEmitOnErrorsPlugin())
  }

  if (config.app.minify) {
    plugins.push(
      new ExtractTextPlugin('[name].css'),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {discardComments: {removeAll: true}},
        canPrint: false,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
        minChunks: Infinity
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
      })
    )
  }

  return plugins
}
