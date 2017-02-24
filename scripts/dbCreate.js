import {config, create} from 'src/db'

const dbConfig = config()
create(dbConfig)
  .then(() => {
    console.log(`Created db '${dbConfig.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
