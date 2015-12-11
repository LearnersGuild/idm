import fs from 'fs'
import path from 'path'

import Promise from 'bluebird'
import swaggerTools from 'swagger-tools'
import YAML from 'yamljs'
import ejs from 'ejs'
import fetch from 'node-fetch'


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = YAML.load(path.join(__dirname, '../config/swagger.yaml'))

// Customize the look-and-feel of the Swagger docs.
function replaceSwaggerUiHtml() {
  const title = 'IDM API'
  const logoUrl = 'https://lg-icons.herokuapp.com/favicon-32x32.png'
  const customSwaggerUiTemplateFilename = path.join(__dirname, '..', 'public', 'swagger-docs.html.ejs')
  const swaggerUiHtmlFilename = path.join(__dirname, '..', 'node_modules', 'swagger-tools', 'middleware', 'swagger-ui', 'index.html')

  return new Promise((resolve) => {
    fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
      .then((resp) => {
        return resp.json()
      }).then((tags) => {
        return tags.join('\n        ')
      }).then((iconsMetadataTagsHtml) => {
        const templateData = fs.readFileSync(customSwaggerUiTemplateFilename).toString('utf-8')
        const renderedTemplate = ejs.render(templateData, { title, logoUrl, iconsMetadataTagsHtml })
        fs.writeFileSync(swaggerUiHtmlFilename, renderedTemplate.toString())
        resolve()
      })
  })
}

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
    replaceSwaggerUiHtml()
      .then(() => {
        app.use(middleware.swaggerUi())

        // Start the server
        return next()
      })
  })
}
