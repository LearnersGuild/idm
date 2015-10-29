require('babel/register')

if (process.env.NODE_ENV === 'development') {
  if (require('piping')()) {
    // application logic here
    require('dotenv').load()
    require('./app')
  }
} else {
  require('./app')
}
