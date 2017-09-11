import graph from 'sagas/graph'

export default function* rootSaga() {
  console.debug('root-saga-started')
  yield [graph()]
}
