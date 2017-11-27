import { takeEvery, put } from 'redux-saga/effects'
import { Map, fromJS } from 'immutable'
import 'whatwg-fetch'
import * as A from 'actions'

export default function* graphSaga() {
  yield takeEvery(A.FETCH_SEARCH_RESULT, handleSearch)
  yield takeEvery(A.FETCH_NODES_AND_LINKS_DATA, handleUpdateGraphData)
  yield takeEvery(A.FETCH_CARD_DATA, handleUpdateCardData)
  yield takeEvery(A.FETCH_COUNT_DATA, handleFetchCount)
}

// const host = `http://10.214.208.50:${PORT}`

const host = `http://10.214.224.126:${PORT}`

function* handleFetchCount() {
  try {
    const url = `${host}/statistic/count`
    const response = yield fetch(url)
    if (response.ok) {
      const data = yield response.json()
      if (data && data.length !== 0) {
        yield put({ type: A.UPDATE_COUNT_DATA, count: fromJS(data) })
      } else {
        console.log('暂无数据')
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function* handleSearch({ keyword }) {
  try {
    yield put({ type: A.RETURN_RESULT, noResult: false })
    yield put({ type: A.UPDATE_KEYWORD, keyword })
    const url = `${host}/search?keyword=${encodeURIComponent(keyword)}`
    const response = yield fetch(url)
    if (response.ok) {
      const json = yield response.json()
      const data = json.data
      if (data && data.length !== 0) {
        const result = fromJS(data).map(i => Map({
          id: i.get('id'),
          type: i.get('type').last(),
          name: i.get('name'),
        }))
        yield put({ type: A.UPDATE_SEARCH_RESULT, result })
      } else {
        console.log('暂无数据')
        yield put({ type: A.RETURN_RESULT, noResult: true })
      }
    } else {
      yield put({ type: A.RETURN_RESULT, noResult: true })
    }
  } catch (e) {
    console.log(e)
  }
}

function* handleUpdateGraphData({ id, resultType, updateFootprint }) {
  try {
    yield put({ type: A.SET_GRAPH_LOADING, isLoading: true })
    const url = `${host}/graph?id=${encodeURIComponent(id)}&type=${resultType}`
    const response = yield fetch(url)
    if (response.ok) {
      const json = yield response.json()
      const data = json.data
      if (data && data.length !== 0) {
        const nodeData = fromJS(data.entities).map(i => Map({
          id: i.get('id'),
          name: i.get('name'),
          type: i.get('type').get(i.get('type').size - 1),
        }))
        const linkData = fromJS(data.relations).map(i => Map({
          source: i.get('objectA'),
          target: i.get('objectB'),
        }))
        yield put({
          type: A.UPDATE_CENTER_ID,
          centerId: data.centerId,
          centerType: resultType,
          centerName: data.centerName,
        })
        if (updateFootprint) {
          yield put({
            type: A.UPDATE_FOOTPRINT,
            centerId: data.centerId,
            centerType: resultType,
            centerName: data.centerName,
          })
        }
        yield put({ type: A.UPDATE_NODES_AND_LINKS_DATA, nodeData, linkData })
      } else {
        console.log('暂无此词条')
      }
    }
    yield put({ type: A.SET_GRAPH_LOADING, isLoading: false })
  } catch (e) {
    console.log(e)
  }
}


function* handleUpdateCardData({ tab, id, cardType }) {
  try {
    const url = `${host}/${cardType.toLowerCase()}/${tab}?${cardType.toLowerCase()}Id=${encodeURIComponent(id)}`
    const response = yield fetch(url)
    if (response.ok) {
      const json = yield response.json()
      yield put({ type: A.UPDATE_CARD_DATA, cardData: fromJS(json.data), tab })
    } else {
      yield put({ type: A.UPDATE_CARD_DATA, cardData: Map(), tab })
    }
  } catch (e) {
    console.log(e)
  }
}
