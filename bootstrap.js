require('babel/register')

if (require('piping')()) {
  // application logic here
  require('dotenv').load()
  require('./app')
}
