/* eslint-disable no-var, xo/no-process-exit */
require('babel-core/register')
require('babel-polyfill')

var db = require('src/db')

db.drop()
  .then(() => {
    console.log(`Successfully dropped database '${db.config.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
