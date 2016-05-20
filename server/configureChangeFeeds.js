/* eslint-disable no-console, camelcase */
import url from 'url'
import getBullQueue from 'bull'

import r from '../db/connect'

function getQueue(queueName) {
  const redisConfig = url.parse(process.env.REDIS_URL)
  const redisOpts = redisConfig.auth ? {auth_pass: redisConfig.auth.split(':')[1]} : undefined
  return getBullQueue(queueName, redisConfig.port, redisConfig.hostname, redisOpts)
}

function pushRelevantNewUsersToGame() {
  const newGameUserQueue = getQueue('newGameUser')

  r.table('users').getAll('moderator', 'player', {index: 'roles'}).changes().filter(r.row('old_val').eq(null))
    .then(cursor => {
      cursor.each((err, {new_val: user}) => {
        if (!err) {
          console.log('pushing new game participant to game:', user)
          newGameUserQueue.add(user)
        }
      })
    })
}

export default function configureChangeFeeds() {
  pushRelevantNewUsersToGame()
}
