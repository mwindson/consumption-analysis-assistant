import { Map, Set } from 'immutable'
import * as A from 'actions'
import config from 'utils/config.yaml'

const initialState = Map({
  // 实体数据与关系数据
  nodeData: Set(),
  linkData: Set(),
  // 控制加载的动画
  graphLoading: false,
})
export default function GraphReducer(state = initialState, action) {
  if (action.type === A.UPDATE_NODES_AND_LINKS_DATA) {
    const { nodeData, linkData } = action
    return state.set('nodeData', nodeData).set('linkData', linkData)
  } else if (action.type === A.SET_GRAPH_LOADING) {
    const { isLoading } = action
    return state.set('graphLoading', isLoading)
  } else {
    return state
  }
}
