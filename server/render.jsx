/* eslint-disable no-undef */

import raven from 'raven'

import React from 'react'
import {renderToString} from 'react-dom/server'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import {RouterContext, match} from 'react-router'

import Root from '../common/containers/Root'
import routes from '../common/routes'
import rootReducer from '../common/reducers'
import iconsMetadata from '../dist/icons-metadata'

const sentry = new raven.Client(process.env.SENTRY_SERVER_DSN)

export function renderFullPage(renderedAppHtml, initialState) {
  const title = 'Identity Management'
  let appCss = ''
  if (process.env.NODE_ENV !== 'development') {
    appCss = `<link href="/app.css" media="screen,projection" rel="stylesheet" type="text/css" />`
  }
  let vendorJs = ''
  if (process.env.NODE_ENV !== 'development') {
    vendorJs = `<script src="/vendor.js"></script>`
  }
  const sentryClientDSN = process.env.SENTRY_CLIENT_DSN ? `'${process.env.SENTRY_CLIENT_DSN}'` : undefined


  return `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Identity Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        ${iconsMetadata.join('\n        ')}
        ${appCss}
      </head>
      <body>

        <div id="root">${renderedAppHtml}</div>

        <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        window.sentryClientDSN = ${sentryClientDSN}
        </script>
        ${vendorJs}
        <script src="/app.js"></script>

      </body>
    </html>
    `
}

function getInitialState(req) {
  // console.log('user:', req.user)
  // console.log('lgJWT:', req.lgJWT)
  const initialState = {
    auth: {
      currentUser: req.user,
      lgJWT: req.lgJWT,
      isBusy: false,
    }
  }
  // This is kind of a hack. Rather than enabling sessions (which would require
  // Redis or another store of some kind), we just pass error codes through the
  // query string so that they can be rendered properly in the UI.
  switch (req.query.err) {
    case 'auth':
      initialState.errors = {
        messages: ['Authentication failed. Are you sure you have an account?']
      }
      break
    default:
      break
  }
  return initialState
}

function fetchAllComponentData(dispatch, renderProps) {
  const {routes} = renderProps
  const funcs = routes.map(route => {
    if (route.component && typeof route.component.fetchData === 'function') {
      return route.component.fetchData(dispatch, renderProps)
    }
  })
  return Promise.all(funcs)
}

function handleError(error, res) {
  console.error(error.stack)
  sentry.captureException(error)
  res.status(500).send(`<h1>500 - Internal Server Error</h1><p>${error}</p>`)
}

export default function handleRender(req, res) {
  try {
    const initialState = getInitialState(req)
    const store = createStore(rootReducer, initialState, compose(
      applyMiddleware(thunk),
    ))

    // This is terrible. See: https://github.com/callemall/material-ui/pull/2172
    global.navigator = {userAgent: req.headers['user-agent']}

    match({routes, location: req.originalUrl}, async (error, redirectLocation, renderProps) => {
      try {
        // console.log('error:', error, 'redirectLocation:', redirectLocation, 'renderProps:', renderProps)
        if (error) {
          throw new Error(error)
        } else if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (!renderProps) {
          res.status(404).send(`<h1>404 - Not Found</h1><p>No such URL: ${req.originalUrl}</p>`)
        } else {
          await fetchAllComponentData(store.dispatch, renderProps)
          const renderedAppHtml = renderToString(
            <Root store={store}>
              <RouterContext {...renderProps}/>
            </Root>
          )
          res.status(200).send(renderFullPage(renderedAppHtml, store.getState()))
        }
      } catch (error) {
        handleError(error)
      }
    })
  } catch (error) {
    handleError(error, res)
  }
}
