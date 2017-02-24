import {config, drop} from 'src/db'

const dbConfig = config()

drop(dbConfig)
  .then(() => {
    console.log(`Dropped db '${dbConfig.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
