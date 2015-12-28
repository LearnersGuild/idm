/* eslint-disable no-undef */

import fetch from 'node-fetch'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from '../common/reducers'
import Root from '../common/containers/Root'


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
  const store = createStore(rootReducer)

  const renderedAppHtml = renderToString(
    <Provider store={store}>
      <Root />
    </Provider>
  )

  const initialState = store.getState()

  fetch(process.env.ICONS_SERVICE_TAGS_API_URL)
    .then((resp) => {
      return resp.json()
    }).then((tags) => {
      res.send(renderFullPage(tags.join('\n        '), renderedAppHtml, initialState))
    })
}
