const path = require('path')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = ({config, root}) => {
  const sassResources = require('src/common/styles/sassResources')

  const rules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: config.app.hotReload ? {
          plugins: [
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }],
            }],
          ],
        } : null,
      },
    },

    // global styles
    {
      test: /Root\.css$/,
      use: _extractText([
        'style-loader',
        {
          loader: 'css-loader',
          options: {sourceMap: true},
        },
      ]),
    },

    // react-toolbox
    {
      test: /\.scss$/,
      use: _extractText([
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
            importLoaders: 3,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            parsers: [autoprefixer],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: `@import "${path.resolve(root, 'common/styles/theme.scss')}";`,
          },
        },
        {
          loader: 'sass-resources-loader',
          options: {resources: sassResources},
        },
      ]),
      include: [
        path.resolve(root, 'node_modules', 'react-toolbox'),
        path.resolve(root, 'common'),
      ]
    },

    // app css styles
    {
      test: /\.css$/,
      use: _extractText([
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
            importLoaders: 2,
          },
        }
      ]),
      include: [
        path.resolve(root, 'common'),
      ],
      exclude: [
        path.resolve(root, 'common', 'containers', 'Root.css'),
      ]
    },

    {
      test: /\.json$/,
      loader: 'json-loader',
    },

    {
      test: /\.(woff2?|ttf|eot|svg)$/,
      use: {
        loader: 'url-loader',
        options: {limit: 10000},
      },
    },
  ]

  const noParse = [
    /node_modules\/google-libphonenumber\/dist/,
  ]

  function _extractText(loaders) {
    return config.app.minify ? ExtractTextPlugin.extract({use: loaders}) : loaders
  }

  return {rules, noParse}
}
