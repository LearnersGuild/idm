
// set up CSS modules when not in production

export default function configureCSSModules() {
  if (process.env.NODE_ENV !== 'production') {
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
}
