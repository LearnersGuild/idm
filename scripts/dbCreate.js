import {config, create} from 'src/db'

create()
  .then(() => {
    console.log(`Successfully created database '${config.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
