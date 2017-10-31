import fetchData from 'sagas/fetchData'

export default function* rootSaga() {
  console.debug('root-saga-started')
  yield [fetchData()]
}
