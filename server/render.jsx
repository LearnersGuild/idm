/* eslint-disable no-undef */

import fetch from 'isomorphic-fetch'

import React from 'react'
import {renderToString} from 'react-dom/server'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import {RoutingContext, match} from 'react-router'

import getRoutes from '../common/routes'
import rootReducer from '../common/reducers'


export function renderFullPage(iconsMetadataTagsHtml, renderedAppHtml, initialState) {
  const title = 'Identity Management'
  let appCss = ''
  if (process.env.NODE_ENV !== 'development') {
    appCss = `<link href="/app.css" media="screen,projection" rel="stylesheet" type="text/css" />`
  }

  return `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Identity Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

        ${iconsMetadataTagsHtml}
        ${appCss}
      </head>
      <body>

        <div id="root">${renderedAppHtml}</div>

        <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        window.sentryClientDSN = ${process.env.SENTRY_CLIENT_DSN}
        </script>
        <script src="/app.js"></script>

      </body>
    </html>
    `
}

export default function handleRender(req, res) {
  fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
    .then(resp => {
      return resp.json()
    }).then(tags => {
      const store = createStore(rootReducer)

      match({routes: getRoutes(store), location: req.originalUrl}, (error, redirectLocation, renderProps) => {
        // console.log('error:', error, 'redirectLocation:', redirectLocation, 'renderProps:', renderProps)
        if (error) {
          throw new Error(error)
        } else if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (!renderProps) {
          res.status(404).send(`<h1>404 - Not Found</h1><p>No such URL: ${req.originalUrl}</p>`)
        } else {
          const renderedAppHtml = renderToString(
            <Provider store={store}>
              <RoutingContext {...renderProps}/>
            </Provider>
          )
          res.send(renderFullPage(tags.join('\n        '), renderedAppHtml, store.getState()))
        }
      })
    }).catch(error => {
      res.status(500).send(`<h1>500 - Internal Server Error</h1><p>${error}</p>`)
    })
}
