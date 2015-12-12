import path from 'path'
import postgrator from 'postgrator'


const run = !module.parent


if (run) {
  const args = process.argv.slice(2)
  if (args.length !== 1) {
    console.info('Usage: npm run db:migrate VERSION    (version to migrate to, or \'max\')')
    process.exit(0)
  }

  if (process.env.NODE_ENV === 'development') {
    require('dotenv').load()
  }
  postgrator.setConfig({
    migrationDirectory: path.join(__dirname, 'migrations'),
    driver: 'pg',
    connectionString: process.env.DATABASE_URL,
  })

  postgrator.migrate(args[0], (err, migrations) => {
    if (err) {
      console.err("ERROR:", err)
      process.exit(1)
    }
    // console.log(migrations)
    process.exit(0)
  })
}
