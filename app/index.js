import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'containers/App'
import 'normalize.css'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('container'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    /* eslint-disable global-require */
    render(require('./containers/App').default)
  })
}
