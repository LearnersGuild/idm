import {config, drop} from 'src/db'

drop()
  .then(() => {
    console.log(`Dropped db '${config.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
