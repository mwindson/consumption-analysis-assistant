import { Map, List } from 'immutable'
import * as A from 'actions'

const initialState = Map({
  nodeData: List(),
  linkData: List(),
  centerId: 0,
  currentCenterId: 0,
  hoverId: 0,
})
export default function reducer(state = initialState, action) {
  if (action.type === A.UPDATE_NODES_AND_LINKS_DATA) {
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
  } else {
    return state
  }
}
