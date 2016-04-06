/* eslint-disable no-console */
import socketClusterServer from 'socketcluster-server'

import r from '../db/connect'

function publishNewUsers(scServer) {
  r.table('users').changes().filter(r.row('old_val').eq(null))
    .then(cursor => {
      cursor.each((err, user) => {
        if (!err) {
          scServer.exchange.publish('newUser', user)
        }
      })
    })
}

function authenticateSubscribe(req, next) {
  const socket = req.socket
  console.log('authToken:', socket.authToken, 'authState:', socket.authState)

  if (socket.authState === socket.AUTHENTICATED) {
    next()
  } else {
    next(`You are not authorized to subscribe to ${req.channel}`)
  }
}

export default function configureSocketCluster(httpServer) {
  const scServer = socketClusterServer.attach(httpServer)

  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, authenticateSubscribe)

  scServer.on('connection', socket => {
    const clientId = socket.remoteAddress ? socket.remoteAddress : 'client'
    console.log(`${clientId} connected`)

    socket.on('auth', (credentials, respond) => {
      if (credentials.secretKey === process.env.SOCKET_SECRET_KEY) {
        console.log(`${clientId} authenticated`)
        respond('Authentication succeeded')
        socket.setAuthToken({key: credentials.secretKey})
      } else {
        console.log(`${clientId} authentication failed`)
        respond('Authentication failed')
      }
    })
  })

  publishNewUsers(scServer)

  return scServer
}
