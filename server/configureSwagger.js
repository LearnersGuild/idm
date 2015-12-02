import path from 'path'
import swaggerTools from 'swagger-tools'
import YAML from 'yamljs'

// swaggerRouter configuration
// const options = {
//   swaggerUi: '/swagger.json',
//   useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
// }

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = YAML.load(path.join(__dirname, '../config/swagger-idm.yaml'))


export default function configureSwagger(app, next) {
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

    // Start the server
    return next()
  })
}
