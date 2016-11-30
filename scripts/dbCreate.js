import {config, create} from 'src/db'

create()
  .then(() => {
    console.log(`Created db '${config.db}'.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err.message, err.stack)
    process.exit(1)
  })
