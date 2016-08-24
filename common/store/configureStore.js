/* eslint-disable no-undef */
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'

import rootReducer from 'src/common/reducers'

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(routerMiddleware(browserHistory), thunk),
    (typeof window !== 'undefined' && typeof window.devToolsExtension !== 'undefined') ? window.devToolsExtension() : f => f
  ))

  return store
}
