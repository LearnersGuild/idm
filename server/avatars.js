import express from 'express'

import {UserAvatar} from 'src/server/services/dataService'

/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const app = new express.Router()

app.get('/:filename', async (req, res) => {
  const {filename} = req.params
  const userId = filename.replace(/\.jpe?g$/, '')
  let userAvatar

  try {
    userAvatar = await UserAvatar.get(userId)
  } catch (error) {
    const notFoundAvatarURL = 'https://brand.learnersguild.org/assets/echo-icon-128x128.png'
    res
      .status(307)
      .redirect(notFoundAvatarURL)
    return
  }

  res
    .status(200)
    .set({
      'Content-Type': 'image/jpeg',
      'Content-Length': userAvatar.jpegData.length,
      'Cache-Tag': userAvatar.updatedAt.getTime(),
    })
    .send(userAvatar.jpegData)
})

export default app
