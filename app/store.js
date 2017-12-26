import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import reducer from 'reducers/index'
import rootSaga from 'sagas/index'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history)
// redux devtools extenstion
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
!PRODUCTION ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
// mount it on the Store
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(historyMiddleware),
  ),
)

// then run the saga
sagaMiddleware.run(rootSaga)

export { store, history }
