/* eslint-disable no-undef */
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunk),
    (typeof window !== 'undefined' && typeof window.devToolsExtension !== 'undefined') ? window.devToolsExtension() : f => f
  ))

  return store
}
