import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from 'store'
import HomePage from './HomePage'

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
class App extends Component {
  render() {
    return (
      <HomePage />
    )
  }
}
