export default function configureCSSModules() {
  const hook = require('css-modules-require-hook')
  hook({
    extensions: ['.css', '.scss'],
    generateScopedName: '[name]__[local]__[hash:base64:5]',
  })
}
