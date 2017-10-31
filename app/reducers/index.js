import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import GraphReducer from './GraphReducer'
import MainReducer from './MainReducer'
import CardsReducer from './CardsReducer'


const reducers = combineReducers({
  main: MainReducer,
  graph: GraphReducer,
  cards: CardsReducer,
  routing: routerReducer,
})

export default reducers
