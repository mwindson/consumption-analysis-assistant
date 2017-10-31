import { Map, List, Set } from 'immutable'
import * as A from 'actions'
import config from 'utils/config.yaml'

const initialState = Map({
  noResult: false,
  popupType: 'none',  // none or searchResult or product -- none 不弹出
  searchResult: List(),
  count: Map(), // 已有实体的统计数据
  footprint: List(),
  // 中心点相关属性
  center: Map({ id: '', name: '', type: 'Brand' }),
})
export default function MainReducer(state = initialState, action) {
  if (action.type === A.UPDATE_SEARCH_RESULT) {
    const { result } = action
    return state.set('searchResult', result).set('noResult', false)
  } else if (action.type === A.UPDATE_CENTER_ID) {
    const { centerId, centerType, centerName } = action
    // 更新中心节点时，添加历史记录
    const oldName = state.get('center').get('name')
    const type = state.get('center').get('type')
    const id = state.get('center').get('id')
    let footprint = state.get('footprint')
    if (oldName !== '') {
      footprint = footprint.unshift(Map({
        name: `${oldName}（${config.nameMap[type]}）`, id, type,
      }))
    }
    if (footprint.size > 10) {
      footprint = footprint.pop()
    }
    console.log(footprint)
    return state.set('center', Map({ id: centerId, name: centerName, type: centerType }))
      .set('footprint', footprint)
  } else if (action.type === A.RETURN_RESULT) {
    const { noResult } = action
    return state.set('noResult', noResult)
  } else if (action.type === A.UPDATE_POPUP_TYPE) {
    const { contentType } = action
    return state.set('popupType', contentType)
  } else if (action.type === A.UPDATE_COUNT_DATA) {
    const { count } = action
    return state.set('count', count)
  } else {
    return state
  }
}
