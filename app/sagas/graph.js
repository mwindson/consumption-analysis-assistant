import { takeEvery, put } from 'redux-saga/effects'
import { List } from 'immutable'
import * as A from 'actions'

export default function* graphSaga() {
  yield takeEvery(A.FETCH_NODES_AND_LINKS_DATA, handleUpdateGraphData)
}

function* handleUpdateGraphData() {
  const graphData = {
    nodes: [
      {
        id: 0,
        name: '小米',
        type: 'center',
      },
      {
        id: 1,
        name: '所属公司',
        type: 'news',
      },
      {
        id: 2,
        name: '新闻列表',
        type: 'news',
      },
      {
        id: 3,
        name: '手机',
        type: 'store_type',
      },
      {
        id: 4,
        name: '笔记本',
        type: 'store_type',
      },
      {
        id: 5,
        name: '家用电器',
        type: 'store_type',
      },
      {
        id: 6,
        name: '华为',
        type: 'related_brand',
      },
      {
        id: 7,
        name: '魅族',
        type: 'related_brand',
      },
      {
        id: 8,
        name: '雷军',
        type: 'person',
      },
      {
        id: 9,
        name: '小米4',
        type: 'product',
      },
      {
        id: 10,
        name: '小米NOTE',
        type: 'product',
      },
      {
        id: 11,
        name: '林斌',
        type: 'person',
      },
      {
        id: 12,
        name: '林斌',
        type: 'person',
      },
      {
        id: 13,
        name: '林斌',
        type: 'person',
      },
      {
        id: 14,
        name: '林斌',
        type: 'person',
      },
      {
        id: 15,
        name: '林斌',
        type: 'person',
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        type: 'news',
        strength: 1,
      },
      {
        source: 0,
        target: 2,
        type: 'news',
        strength: 1,

      },
      {
        source: 0,
        target: 3,
        type: 'store_type',
        strength: 2,
      },
      {
        source: 0,
        target: 4,
        type: 'store_type',
        strength: 2,
      },
      {
        source: 0,
        target: 5,
        type: 'store_type',
        strength: 3,
      },
      {
        source: 0,
        target: 6,
        type: 'related_brand',
        strength: 3,
      },
      {
        source: 0,
        target: 7,
        type: 'related_brand',
        strength: 4,
      },
      {
        source: 0,
        target: 8,
        type: 'person',
        strength: 4,
      },
      {
        source: 0,
        target: 9,
        type: 'product',
        strength: 5,
      },
      {
        source: 0,
        target: 10,
        type: 'product',
        strength: 5,
      },
      {
        source: 0,
        target: 11,
        type: 'person',
        strength: 5,
      },
      {
        source: 8,
        target: 0,
        type: 'related_brand',
        strength: 1,
      },
      {
        source: 8,
        target: 11,
        type: 'news',
        strength: 1,
      },
      {
        source: 8,
        target: 12,
        type: 'product',
        strength: 1,
      },
      {
        source: 8,
        target: 13,
        type: 'product',
        strength: 1,
      },
      {
        source: 8,
        target: 14,
        type: 'product',
        strength: 1,
      },
      {
        source: 8,
        target: 15,
        type: 'product',
        strength: 1,
      },
    ],
  }
  try {
    yield put({
      type: A.UPDATE_NODES_AND_LINKS_DATA,
      nodeData: List(graphData.nodes),
      linkData: List(graphData.links),
    })
  } catch (e) {
    console.log(e)
  }
}
