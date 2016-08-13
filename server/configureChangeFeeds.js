/* eslint-disable no-console, camelcase */
import url from 'url'
import getBullQueue from 'bull'

import config from 'src/config'
import db from 'src/db'

const r = db.connect()

function getQueue(queueName) {
  const redisConfig = url.parse(config.server.redis.url)
  const redisOpts = redisConfig.auth ? {auth_pass: redisConfig.auth.split(':')[1]} : undefined
  return getBullQueue(queueName, redisConfig.port, redisConfig.hostname, redisOpts)
}

function pushRelevantNewUsersToGame() {
  const newGameUserQueue = getQueue('newGameUser')

  // this is not ideal, because if a user has both the 'moderator' and the
  // 'player' role, we'll add that user to the queue twice, so on the other
  // end of the queue, some de-duplication needs to happen
  r.table('users')
    .getAll('moderator', 'player', {index: 'roles'})
    .changes()
    .filter(r.row('old_val').eq(null))
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
