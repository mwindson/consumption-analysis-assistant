import { Map, List } from 'immutable'
import * as A from 'actions'

const initialState = Map({
  noResult: false,
  searchResult: List(),
  contentType: 'history', // 'history' / 'moreResult'
  floatLayerOpen: false,
  keyword: '',
  count: Map(), // 已有实体的统计数据
  footprint: List(),
  // 中心点相关属性
  center: Map({ id: '', name: '', type: 'Brand' }),
})
export default function MainReducer(state = initialState, action) {
  if (action.type === A.UPDATE_SEARCH_RESULT) {
    const { result, keyword } = action
    return state.set('searchResult', result).set('noResult', false).set('keyword', keyword)
  } else if (action.type === A.UPDATE_CENTER_ID) {
    const { centerId, centerType, centerName, updateFootprint } = action
    const center = Map({ id: centerId, name: centerName, type: centerType })
    // 添加历史记录
    let footprint = state.get('footprint')
    if (updateFootprint) {
      footprint = footprint.push(Map({ id: centerId, name: centerName, type: centerType }))
      return state.set('center', center).set('footprint', footprint)
    } else {
      return state.set('center', center)
    }
  } else if (action.type === A.RETURN_RESULT) {
    const { noResult } = action
    return state.set('noResult', noResult)
  } else if (action.type === A.CHANGE_OPEN_TYPE) {
    const { contentType } = action
    return state.set('contentType', contentType)
  } else if (action.type === A.FLOAT_LAYER_OPEN) {
    const { isOpen } = action
    return state.set('floatLayerOpen', isOpen)
  } else if (action.type === A.UPDATE_COUNT_DATA) {
    const { count } = action
    return state.set('count', count)
  } else {
    return state
  }
}
