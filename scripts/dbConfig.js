/* eslint-disable no-var */
require('babel-core/register')
require('babel-polyfill')

var db = require('src/db')

console.log(JSON.stringify(db.config))
