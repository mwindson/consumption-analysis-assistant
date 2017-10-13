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
const middleware = routerMiddleware(history)
// mount it on the Store
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(middleware),
  ),
)

// then run the saga
sagaMiddleware.run(rootSaga)

export { store, history }
