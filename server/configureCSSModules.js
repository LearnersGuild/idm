import fs from 'fs'
import path from 'path'
import sass from 'node-sass'

export default function configureCSSModules() {
  const hook = require('css-modules-require-hook')

  const resourcesScss = fs.readFileSync(path.resolve(__dirname, '..', 'config', 'sass-resources.scss'))
  hook({
    extensions: ['.css', '.scss'],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    preprocessCss: (css, file) => {
      const includePaths = [path.resolve(__dirname, '..'), path.dirname(file)]
      const result = sass.renderSync({
        data: resourcesScss + css,
        includePaths,
      })
      return result.css
    }
  })
}
