/* eslint-disable no-console, camelcase */
import url from 'url'
import getBullQueue from 'bull'

import r from '../db/connect'

function getQueue(queueName) {
  const redisConfig = url.parse(process.env.REDIS_URL)
  const redisOpts = redisConfig.auth ? {auth_pass: redisConfig.auth.split(':')[1]} : undefined
  return getBullQueue(queueName, redisConfig.port, redisConfig.hostname, redisOpts)
}

function pushNewPlayersToGame() {
  const newPlayerQueue = getQueue('newPlayer')

  r.table('users').getAll('player', {index: 'roles'}).changes().filter(r.row('old_val').eq(null))
    .then(cursor => {
      cursor.each((err, {new_val: user}) => {
        if (!err) {
          console.log('pushing new player to game:', user)
          newPlayerQueue.add(user)
        }
      })
    })
}

export default function configureChangeFeeds() {
  try {
    pushNewPlayersToGame()
  } catch (err) {
    console.error(err.stack)
  }
}
