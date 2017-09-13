import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'containers/App'

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('container'),
)

// hot-reload for App
if (module.hot) {
  module.hot.accept('./containers/App.jsx', () => {
    /* eslint-disable global-require */
    const NewApp = require('./containers/App.jsx').default
    ReactDOM.render(
      <NewApp />,
      document.getElementById('container'),
    )
  })
}

// const render = (Component) => {
//   ReactDOM.render(
//     <AppContainer>
//       <Component />
//     </AppContainer>,
//     document.getElementById('container'),
//   )
// }
//
// render(App)
//
// if (module.hot) {
//   module.hot.accept('./containers/App', () => {
//     /* eslint-disable global-require */
//     render(require('./containers/App').default)
//   })
// }
