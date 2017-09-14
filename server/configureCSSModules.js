import path from 'path'
import sass from 'node-sass'

export default function configureCSSModules() {
  const hook = require('css-modules-require-hook')

  const resourcePaths = require('src/common/styles/sassResources')
  const resourceScss = resourcePaths.reduce((result, path) => {
    const resourceImport = _pathToImport(path)
    return result ? `${result}\n${resourceImport}` : resourceImport
  }, null)

  hook({
    extensions: ['.css', '.scss'],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    preprocessCss: (css, file) => {
      const includePaths = [path.resolve(__dirname, '..'), path.dirname(file)]
      const result = sass.renderSync({
        data: resourceScss + css,
        includePaths,
      })
      return result.css
    }
  })
}

function _pathToImport(path) {
  return `@import "${path}";`
}
