import { Map, List } from 'immutable'
import * as A from 'actions'

const initialState = Map({
  nodeData: List(),
  linkData: List(),
  cardData: Map(),
  centerId: 0,
  currentCenterId: 0,
  hoverId: 0,
  id: '0',
  name: '0',
})
export default function reducer(state = initialState, action) {
  if (action.type === A.UPDATE_CARD_DATA) {
    const { cardData } = action
    return state.set('cardData', cardData)
  } else if (action.type === A.UPDATE_NODES_AND_LINKS_DATA) {
    const { nodeData, linkData } = action
    return state.set('nodeData', nodeData).set('linkData', linkData)
  } else if (action.type === A.UPDATE_CENTER_ID) {
    const { centerId } = action
    return state.set('centerId', centerId)
  } else if (action.type === A.CHANGE_CURRENT_CENTER_ID) {
    const { currentCenterId } = action
    return state.set('currentCenterId', currentCenterId)
  } else if (action.type === A.CHANGE_HOVER_ID) {
    const { hoverId } = action
    return state.set('hoverId', hoverId)
  } else if (action.type === A.UPDATE_WS_DATA) {
    const { id, name } = action
    return state.set('id', id).set('name', name)
  } else {
    return state
  }
}
