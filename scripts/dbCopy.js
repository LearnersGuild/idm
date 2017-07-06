import path from 'path'
import child from 'child_process'
import s3 from 's3'

import config from 'src/config'

const dbConfig = require('src/db').config()
const s3Client = s3.createClient({s3Options: config.server.aws.s3})

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function run() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot be run in production')
  }

  const dbFileName = `${dbConfig.db}.tar`
  const outputPath = path.resolve(__dirname, `../tmp/${dbFileName}`)

  console.log(`Cloning db ${dbFileName} from S3...`)

  await _downloadDBCopy(outputPath, dbFileName)
  await _importDBCopy(outputPath)
}

function _downloadDBCopy(outputPath, dbFileName) {
  return new Promise((resolve, reject) => {
    const downloader = s3Client.downloadFile({
      localFile: outputPath,
      s3Params: {
        Bucket: process.env.S3_BUCKET,
        Key: `${process.env.S3_KEY_PREFIX}/${dbFileName}`,
      },
    })

    downloader
      .on('error', err => {
        console.error('Download error:', err)
        reject(err)
      })
      .on('end', () => resolve())
  })
}

function _importDBCopy(outputPath) {
  return new Promise((resolve, reject) => {
    const ls = child.spawn('rethinkdb', ['restore', outputPath])

    ls.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', err => {
      console.log(`stderr: ${err}`)
      reject(err)
    })

    ls.on('close', code => {
      console.log(`import exited with code ${code}`)
      resolve()
    })
  })
}
