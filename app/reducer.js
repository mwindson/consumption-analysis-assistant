import { Map, List, Set } from 'immutable'
import * as A from 'actions'

const initialState = Map({
  nodeData: Set(),
  linkData: Set(),
  cardData: Map(),
  centerId: 'maigoo:美的Midea',
  currentCenterId: '',
  // 关系图与中心点相连的关系点的类型 -- all,person,product,related_brand
  graphType: 'all',
  tab: 'knowledge',
  noResult: false,
})
export default function reducer(state = initialState, action) {
  if (action.type === A.UPDATE_CARD_DATA) {
    const { cardData } = action
    return state.set('cardData', cardData)
  } else if (action.type === A.UPDATE_NODES_AND_LINKS_DATA) {
    const { nodeData, linkData } = action
    return state.set('nodeData', nodeData)
      .set('linkData', linkData).set('noResult', false)
  } else if (action.type === A.UPDATE_CENTER_ID) {
    const { centerId } = action
    return state.set('centerId', centerId)
  } else if (action.type === A.CHANGE_CURRENT_CENTER_ID) {
    const { id } = action
    return state.set('currentCenterId', id)
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
  } else {
    return state
  }
}
