var babelJest = require('babel-jest')

module.exports = {
  process: function process(src, filename) {
    if (filename.match(/\.[css|scss]/)) {
      return ''
    }

    return babelJest.process(src, filename)
  }
}
