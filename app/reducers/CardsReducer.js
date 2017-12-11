import { Map } from 'immutable'
import * as A from 'actions'

const initialState = Map({
  cardData: Map(),
  tab: 'knowledge',
  originData: Map(),
})

// 处理知识卡片的reducer————cardData：卡片数据，tab：选项卡
export default function CardsReducer(state = initialState, action) {
  if (action.type === A.UPDATE_CARD_DATA) {
    const { cardData, tab } = action
    return state.set('cardData', cardData).set('tab', tab)
  } else if (action.type === A.CHANGE_TAB) {
    const { tab } = action
    return state.set('tab', tab)
  } else if (action.type === A.UPDATE_ORIGIN_DATA) {
    const { originData } = action
    return state.set('originData', originData)
  } else {
    return state
  }
}
