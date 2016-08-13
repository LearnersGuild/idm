import React from 'react'
import {renderToString} from 'react-dom/server'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import {RouterContext, match} from 'react-router'

import iconsMetadata from '../dist/icons-metadata'

const config = require('src/config')

export function renderFullPage(renderedAppHtml, initialState) {
  const title = 'Identity Management'
  let appCss = ''
  if (config.app.minify) {
    appCss = '<link href="/app.css" media="screen,projection" rel="stylesheet" type="text/css" />'
  }
  let vendorJs = ''
  if (config.app.minify) {
    vendorJs = '<script src="/vendor.js"></script>'
  }
  const sentryClientDSN = config.app.sentryDSN ? `'${config.app.sentryDSN}'` : undefined

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
        messages: ['Authentication failed. Are you sure you have an active account?']
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
    return route.component && typeof route.component.fetchData === 'function' ?
      route.component.fetchData(dispatch, renderProps) : null
  })
  return Promise.all(funcs)
}

export default function handleRender(req, res, next) {
  try {
    // we require() these rather than importing them because (in development)
    // we may have flushed the require cache (when files change), but if we
    // import them at the top, this module will still be holding references to
    // the previously-imported versions
    const Root = require('../common/containers/Root').default
    const routes = require('../common/routes')
    const rootReducer = require('../common/reducers')

    const initialState = getInitialState(req)
    const store = createStore(rootReducer, initialState, compose(
      applyMiddleware(thunk),
    ))

    // This is terrible. See: https://github.com/callemall/material-ui/pull/2172
    global.navigator = {userAgent: req.headers['user-agent']}

    match({routes: routes(store), location: req.originalUrl}, async (error, redirectLocation, renderProps) => {
      try {
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
        next(error)
      }
    })
  } catch (error) {
    next(error)
  }
}
