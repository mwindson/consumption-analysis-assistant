import { takeEvery, put } from 'redux-saga/effects'
import { Map, fromJS } from 'immutable'
import * as A from 'actions'

export default function* graphSaga() {
  yield takeEvery(A.FETCH_SEARCH_RESULT, handleSearch)
  yield takeEvery(A.FETCH_NODES_AND_LINKS_DATA, handleUpdateGraphData)
  yield takeEvery(A.FETCH_CARD_DATA, handleUpdateCardData)
}

const host = 'http://10.214.208.50:9001'

function* handleSearch({ keyword }) {
  try {
    const url = `${host}/search?keyword=${keyword}`
    const response = yield fetch(url)
    if (response.ok) {
      const json = yield response.json()
      const data = json.data
      if (data) {
        const result = fromJS(data).map(i => Map({
          id: i.get('id'),
          type: i.get('type').last(),
          name: i.get('name'),
        }))
        yield put({ type: A.UPDATE_SEARCH_RESULT, result })
      } else {
        console.log('暂无数据')
        yield put({ type: A.RETURN_NO_RESULT })
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function* handleUpdateGraphData({ id, resultType }) {
  try {
    const url = `${host}/graph?id=${id}&type=${resultType}`
    const response = yield fetch(url)
    if (response.ok) {
      const json = yield response.json()
      const data = json.data
      if (data) {
        const nodeData = fromJS(data.entities).map(i => Map({
          id: i.get('id'),
          name: i.get('name'),
          type: i.get('type').get(i.get('type').size - 1),
        }))
        const linkData = fromJS(data.relations).map(i => Map({
          source: i.get('objectA'),
          target: i.get('objectB'),
          score: i.get('score'),
        }))
        yield put({ type: A.UPDATE_CENTER_ID, centerId: data.centerId })
        yield put({ type: A.UPDATE_NODES_AND_LINKS_DATA, nodeData, linkData })
      } else {
        alert('暂无此词条')
      }
    }
  } catch (e) {
    console.log(e)
  }
}


function* handleUpdateCardData({ tab, brandId }) {
  if (tab === 'knowledge' || tab === 'relatedBrands') {
    try {
      const url = `${host}/brand/${tab}?brandId=${brandId}`
      const response = yield fetch(url)
      if (response.ok) {
        const json = yield response.json()
        yield put({ type: A.UPDATE_CARD_DATA, cardData: fromJS(json.data) })
      }
    } catch (e) {
      console.log(e)
    }
  }
}
