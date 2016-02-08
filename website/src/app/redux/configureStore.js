import { applyMiddleware, compose, createStore } from 'redux'
import { syncHistory } from 'redux-simple-router'
import sagaMiddleware from 'redux-saga'
import rootReducer from '../../reducer'
import rootSaga from '../../saga'

function withDevTools (middleware) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : require('../DevTools').default.instrument()
  return compose(middleware, devTools)
}

export default function configureStore ({ initialState = {}, history }) {
  // Sync with router via history instance (main.js)
  const routerMiddleware = syncHistory(history)
  const saga = sagaMiddleware(rootSaga)

  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(saga, routerMiddleware)
  if (__DEBUG__) middleware = withDevTools(middleware)

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState)
  if (__DEBUG__) routerMiddleware.listenForReplays(store, ({ router }) => router)

  if (module.hot) {
    module.hot.accept('../../reducer', () => {
      const nextRootReducer = require('../../reducer').default

      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
