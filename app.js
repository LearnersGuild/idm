import path from 'path'
import connect from 'connect'
import http from 'http'
import swaggerTools from 'swagger-tools'
import YAML from 'yamljs'

const serverHost = process.env.APP_HOSTNAME || 'localhost'
const serverPort = process.env.PORT || 8080
const app = connect()

// swaggerRouter configuration
// const options = {
//   swaggerUi: '/swagger.json',
//   useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
// }

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = YAML.load(path.join(__dirname, 'swagger-idm.yaml'))

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata())

  // Validate Swagger requests
  app.use(middleware.swaggerValidator())

  // Route validated requests to appropriate controller
  // app.use(middleware.swaggerRouter(options))

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi())

  // Redirect to the default docs
  app.use('/', (req, res) => {
    res.writeHead(301, { Location: '/docs/#!/default' })
    res.end()
  })

  // Start the server
  http.createServer(app).listen(serverPort, () => {
    console.log('🌍  Your server is listening at http://%s:%d ', serverHost, serverPort)
  })
})
