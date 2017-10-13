import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { store, history } from 'store'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import HomePage from './HomePage'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
            </Switch>
          </Router>
        </ConnectedRouter>
      </Provider>
    )
  }
}
