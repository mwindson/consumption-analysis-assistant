import { eventChannel } from 'redux-saga'
import { call, take, put } from 'redux-saga/effects'
import * as A from 'actions'

export default function* websocketSaga() {
  const channel = yield call(websocketInitChannel)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

function websocketInitChannel() {
  return eventChannel((emitter) => {
    // init the connection here
    const ws = new WebSocket('ws://10.214.224.126:9001/ws?keyword=小米')

    ws.onopen = () => {
      console.log('opening...')
    }
    ws.onerror = (error) => {
      console.error(error)
    }
    ws.onmessage = (e) => {
      let msg = null
      try {
        msg = JSON.parse(e.data)
      } catch (error) {
        console.error(`Error parsing : ${e.data}`, error)
      }
      if (msg) {
        const { id, name } = msg
        console.log(msg)
        return emitter({ type: A.UPDATE_WS_DATA, id, name })
        // nothing to do
      } else {
        return null
      }
    }
    return () => {
      // do whatever to interrupt the socket communication here
      console.log('connection end')
    }
  })
}
