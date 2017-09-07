// start workers
require('./userCreated').start()

// start change feed listeners
require('src/server/configureChangeFeeds')()
