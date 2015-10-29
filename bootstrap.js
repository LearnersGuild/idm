require('babel/register')

if (require('piping')()) {
  // application logic here
  if (process.env.NODE_ENV === 'development') {
    require('dotenv').load()
  }
  require('./app')
}
