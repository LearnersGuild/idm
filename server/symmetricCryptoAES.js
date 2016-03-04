import crypto from 'crypto'

const STATE_SECRET = crypto.randomBytes(16)
const INIT_VECTOR = crypto.randomBytes(16)

export function encrypt(plaintext) {
  const cipher = crypto.createCipheriv('aes-128-cbc', STATE_SECRET, INIT_VECTOR)
  // console.log('plaintext:', plaintext)
  let encrypted = cipher.update(plaintext, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  // console.log('encrypted:', encrypted)
  return encrypted
}

export function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv('aes-128-cbc', STATE_SECRET, INIT_VECTOR)
  // console.log('encrypted:', encrypted)
  let plaintext = decipher.update(encrypted, 'base64', 'utf8')
  plaintext += decipher.final('utf8')
  // console.log('plaintext:', plaintext)
  return plaintext
}
