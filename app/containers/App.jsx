import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from 'store'
import HomePage from './HomePage'

// export default () => (
//
//   <App />
//   < /Provider>
// )

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    )
  }
}
