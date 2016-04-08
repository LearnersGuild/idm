import path from 'path'

export default function configureAppForDevelopment(app) {
  if (process.env.NODE_ENV === 'development') {
    const chokidar = require('chokidar')
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../config/webpack-development-config')
    const compiler = webpack(webpackConfig)

    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }))
    app.use(webpackHotMiddleware(compiler))

    // "hot-reload" (flush require cache) server code when it changes
    const cwd = path.resolve(__dirname, '..')
    const watcher = chokidar.watch(['db', 'server'], {cwd})
    watcher.on('ready', () => {
      watcher.on('all', (operation, path) => {
        console.log(`(${operation}) ${path} -- clearing /server/ module cache from server`)
        Object.keys(require.cache).forEach(id => {
          if (/[\/\\]server[\/\\]/.test(id)) {
            delete require.cache[id]
          }
        })
      })
    })

    // "hot-reload" (flush require cache) if webpack rebuilds
    compiler.plugin('done', () => {
      console.log(`webpack compilation finished -- clearing /client/ and /common/ module cache from server`)
      Object.keys(require.cache).forEach(id => {
        if (/[\/\\](client|common)[\/\\]/.test(id)) {
          delete require.cache[id]
        }
      })
    })
  }
}
