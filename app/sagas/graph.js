import { takeEvery, put } from 'redux-saga/effects'
import { List, fromJS } from 'immutable'
import * as A from 'actions'

export default function* graphSaga() {
  yield takeEvery(A.FETCH_NODES_AND_LINKS_DATA, handleUpdateGraphData)
  yield takeEvery(A.FETCH_CARD_DATA, handleUpdateCardData)
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

function* handleUpdateCardData() {
  const cardData = {
    knowledge: [{ title: '品牌信息', type: 'intro', content: [{ url: 'static/image/logo.png', text: '品牌信息介绍' }] },
      { title: '企业信息', type: 'company', content: [{ url: 'static/image/company.png', text: '企业信息介绍' }] },
      { title: '业态', type: 'store_type', content: [{ url: 'static/image/store_type.png', text: '经营业态介绍' }] },
      {
        title: '相关人物',
        type: 'person',
        content: [
          { url: 'static/image/person1.png', text: '创始人' },
          { url: 'static/image/person2.png', text: 'CEO' },
          { url: 'static/image/person3.png', text: '首席设计师' },
          { url: 'static/image/person4.png', text: '代言人' },
          { url: 'static/image/person5.png', text: '明星' },
          { url: 'static/image/person1.png', text: '创始人' },
          { url: 'static/image/person2.png', text: 'CEO' },
          { url: 'static/image/person3.png', text: '首席设计师' },
          { url: 'static/image/person4.png', text: '代言人' },
        ],
      },
      {
        title: '门店信息',
        type: 'store',
        content: [
          { url: 'static/image/shop1.png', text: '1号店' },
          { url: 'static/image/shop2.png', text: '2号店' },
          { url: 'static/image/shop3.png', text: '3号店' },
          { url: 'static/image/shop3.png', text: '4号店' },
          { url: 'static/image/shop3.png', text: '5号店' },
          { url: 'static/image/shop3.png', text: '6号店' },
        ],
      },
      {
        title: '热门商品',
        type: 'product',
        content: [
          { url: 'static/image/product1.png', text: '包' },
          { url: 'static/image/product2.png', text: '化妆品' },
          { url: 'static/image/product3.png', text: '香水' }],
      },
    ],
    hot: {
      keywords: ['关键词1', '关键词2', '关键词3', '关键词4', '关键词5', '关键词6', '关键词7', '关键词8', '关键词9'],
      newsList: [
        {
          title: '香奈儿最新事件',
          content: '当时,老佛爷Karl Lagerfeld把香奈儿2016年早春度假系列的96款服装发布第一次放到了首尔。同期宣... 香奈儿韩国市场权志龙朴信惠 香奈儿2016/17“巴黎大都会”高级..',
          img: '.',
          url: 'http://www.baidu.com',
          keywords: ['关键词1'],
        },
        {
          title: 'channel news 最新时尚资讯1',
          content: '在首尔举办的Mademoiselle Privé展览上,呈现了嘉柏丽尔·香奈儿于1932年创作的“Bijoux de Diamants”钻石珠宝系列。当年,她在系列首次展出的媒体宣传稿中写道: “对...',
          img: '.',
          url: 'http://www.baidu.com',
          keywords: ['关键词1', '关键词2'],
        },
        {
          title: 'channel news 最新时尚资讯2',
          content: '在首尔举办的Mademoiselle Privé展览上,呈现了嘉柏丽尔·香奈儿于1932年创作的“Bijoux de Diamants”钻石珠宝系列。当年,她在系列首次展出的媒体宣传稿中写道: “对...',
          img: '.',
          url: 'http://www.baidu.com',
          keywords: ['关键词3'],
        },
      ],
    },
    trend: [{ title: '股票信息', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
      { title: '股票数据', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
      { title: '股票统计', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
    ],
    related: [{ title: '评价情感', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
      { title: '高级分析', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
      { title: '业态', type: 'intro', content: [{ url: 'static/image/logo.png', text: 'text' }] },
    ],
  }
  try {
    yield put({ type: A.UPDATE_CARD_DATA, cardData: fromJS(cardData) })
  } catch (e) {
    console.log(e)
  }
}
