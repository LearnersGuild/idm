/* eslint-disable no-undef */

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import Root from '../common/containers/Root'


function renderFullPage(renderedAppHtml, initialState) {
  const { title } = initialState
  let appCss = ''
  if (!__DEVELOPMENT__) {
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

        <!--
        <link rel="apple-touch-icon" href="/images/icon.png" />
        <link rel="icon" href="/images/icon.png" />
        -->

        ${appCss}
      </head>
      <body>

        <div id="root">${renderedAppHtml}</div>

        <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
        <script src="/app.js"></script>

      </body>
    </html>
    `
}

export default function handleRender(req, res) {
  const initialState = {
    title: 'Identity Management'
  }
  const renderedAppHtml = ReactDOMServer.renderToString(
    <Root />
  )
  res.send(renderFullPage(renderedAppHtml, initialState))
}
