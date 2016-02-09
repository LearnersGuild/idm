import path from 'path'
import fs from 'fs'

export default function configureCSSModules() {
  const hook = require('css-modules-require-hook')
  const sass = require('node-sass')
  hook({
    extensions: ['.scss'],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    preprocessCss: css => {
      const includePaths = [path.join(__dirname, '..')]
      const resourcesScss = fs.readFileSync(path.join(__dirname, '..', 'config', 'sass-resources.scss'))
      const result = sass.renderSync({
        data: resourcesScss + css,
        includePaths,
      })
      return result.css
    }
  })
}
