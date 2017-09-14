const path = require('path')

// Make bourbon / neat variables and mixins available when using CSS modules.
module.exports = [
  path.resolve(__dirname, '../../node_modules/bourbon/app/assets/stylesheets/_bourbon.scss'),
  path.resolve(__dirname, '../../node_modules/bourbon-neat/app/assets/stylesheets/_neat.scss'),
  path.resolve(__dirname, 'resources.scss'),
]
