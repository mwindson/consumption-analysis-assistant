import graph from 'sagas/graph'
import websocket from 'sagas/websocketSagas'

export default function* rootSaga() {
  console.debug('root-saga-started')
  yield [graph()]
}
