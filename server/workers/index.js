// start workers
require('./userCreated').start()
require('./userEmailUpdated').start()

// start change feed listeners
require('src/server/configureChangeFeeds')()
