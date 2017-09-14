import express from 'express'

import {UserAvatar} from 'src/server/services/dataService'
import {errors} from 'src/server/services/dataService'

/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const app = new express.Router()

app.get('/:filename', async (req, res, next) => {
  const {filename} = req.params
  const userId = filename.replace(/\.jpe?g$/, '')
  UserAvatar.get(userId)
    .then(userAvatar => {
      res
        .status(200)
        .set({
          'Content-Type': 'image/jpeg',
          'Content-Length': userAvatar.jpegData.length,
          'Cache-Tag': userAvatar.updatedAt.getTime(),
        })
        .send(userAvatar.jpegData)
    })
    .catch(errors.DocumentNotFound, () => {
      const notFoundAvatarURL = 'https://brand.learnersguild.org/assets/echo-icon-128x128.png'
      res
        .status(307)
        .redirect(notFoundAvatarURL)
    })
    .catch(next)
})

export default app
