// set configuration dir path
process.env.NODE_CONFIG_DIR = __dirname

// load env variables from .env.[environment name]
require('dotenv').config({
  silent: true,
  path: require('path').resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

module.exports = require('config')
