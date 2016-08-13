/* eslint-disable no-var, xo/no-process-exit */
require('babel-core/register')
require('babel-polyfill')

var db = require('src/db')

db.create()
  .then(() => {
    console.log(`Successfully created database '${db.config.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
