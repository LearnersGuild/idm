export default function configureCSSModules() {
  const hook = require('css-modules-require-hook')
  const sass = require('node-sass')
  hook({
    extensions: ['.scss'],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
    preprocessCss: css => {
      const result = sass.renderSync({
        data: css
      })
      return result.css
    }
  })
}
