import { eventChannel } from 'redux-saga'
import { call, take, put, takeEvery } from 'redux-saga/effects'
import { Set, fromJS, Map } from 'immutable'
import * as A from 'actions'

export default function* websocketSaga() {
  // const { keyword } = yield take(A.FETCH_NODES_AND_LINKS_DATA)

  yield takeEvery(A.FETCH_NODES_AND_LINKS_DATA, startWS)
}

function* startWS({ keyword }) {
  const channel = yield call(websocketInitChannel, keyword)
  while (true) {
    const action = yield take(channel)
    if (action.centerId) {
      yield put(action.centerId)
    }
    yield put(action.data)
  }
}

function websocketInitChannel(keyword) {
  return eventChannel((emitter) => {
    // init the connection here
    const ws = new WebSocket(`ws://10.214.224.126:9001/ws?keyword=${keyword}`)

    ws.onopen = () => {
      console.log('opening...')
    }
    ws.onerror = (error) => {
      console.error(error)
      // todo 返回错误信息
      // return emitter({ type: A.UPDATE_NODES_AND_LINKS_DATA, })
    }
    ws.onmessage = (e) => {
      let msg = null
      try {
        msg = JSON.parse(e.data)
      } catch (error) {
        console.error(`Error parsing : ${e.data}`, error)
      }
      if (msg) {
        const nodeData = fromJS(msg.entities).map(i => Map({
          id: i.get('id'),
          name: i.get('name'),
          type: i.get('type').get(i.get('type').size - 1),
        })).toSet()
        const linkData = fromJS(msg.relations).map(i => Map({
          source: i.get('objectA'),
          target: i.get('objectB'),
          score: i.get('score'),
        })).toSet()
        const actions = { data: { type: A.UPDATE_NODES_AND_LINKS_DATA, nodeData, linkData } }
        if (msg.centerId !== '') {
          actions.centerId = { type: A.UPDATE_CENTER_ID, centerId: msg.centerId }
        }
        return emitter(actions)
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
