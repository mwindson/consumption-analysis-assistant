import { Map, List, Set } from 'immutable'
import * as A from 'actions'
import config from 'utils/config.yaml'

const initialState = Map({
  nodeData: Set(),
  linkData: Set(),
  cardData: Map(),
  centerId: '',
  centerName: '',
  centerType: 'Brand',
  // 关系图与中心点相连关系点的类型 -- all,person,product,related_brand
  graphType: 'all',
  tab: 'knowledge',
  noResult: false,
  popupType: 'none',  // none or searchResult or product -- none 不弹出
  searchResult: List(),
  productDetail: Map(),
  graphLoading: false,
  count: Map(),
  history: List(),
})
export default function reducer(state = initialState, action) {
  if (action.type === A.UPDATE_SEARCH_RESULT) {
    const { result } = action
    return state.set('searchResult', result).set('noResult', false)
  } else if (action.type === A.UPDATE_CARD_DATA) {
    const { cardData } = action
    return state.set('cardData', cardData)
  } else if (action.type === A.UPDATE_NODES_AND_LINKS_DATA) {
    const { nodeData, linkData } = action
    return state.set('nodeData', nodeData).set('linkData', linkData).set('noResult', false).set('graphLoading', false)
  } else if (action.type === A.UPDATE_CENTER_ID) {
    const { centerId, centerType, centerName } = action
    // 更新中心节点时，添加历史记录
    const oldName = state.get('centerName')
    let history = state.get('history')
    if (oldName !== '') {
      history = history.push(Map({
        name: `${oldName}（${config.nameMap[state.get('centerType')]}）`,
        id: state.get('centerId'),
        type: state.get('centerType'),
      }))
    }
    if (history.size > 10) {
      history = history.shift()
    }
    return state.set('centerId', centerId).set('centerType', centerType).set('tab', config[centerType][0].key)
      .set('centerName', centerName)
      .set('history', history)
  } else if (action.type === A.UPDATE_GRAPH_TYPE) {
    const { graphType } = action
    return state.set('graphType', graphType)
  } else if (action.type === A.CLEAR_CARD_DATA) {
    return state.set('cardData', Map())
  } else if (action.type === A.CHANGE_TAB) {
    const { tab } = action
    return state.set('tab', tab)
  } else if (action.type === A.RETURN_NO_RESULT) {
    return state.set('noResult', true)
  } else if (action.type === A.UPDATE_POPUP_TYPE) {
    const { contentType, id } = action
    let productDetail
    if (id !== '' && state.get('cardData').get('products').size !== 0) {
      const products = state.get('cardData').get('products').filter(x => x.get('id') === id).first()
      productDetail = Map({
        name: products.get('name'),
        brand: products.get('brand'),
        category: products.get('category'),
        description: products.get('description'),
        sku: products.get('sku'),
        source: products.get('source'),
        url: products.get('url'),
        optional: products.get('optional'),
      })
    } else {
      productDetail = Map()
    }
    return state.set('popupType', contentType).set('productDetail', productDetail)
  } else if (action.type === A.SET_GRAPH_LOADING) {
    return state.set('graphLoading', true)
  } else if (action.type === A.UPDATE_COUNT_DATA) {
    const { count } = action
    return state.set('count', count)
  } else {
    return state
  }
}
