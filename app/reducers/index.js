import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import reducer from './reducer'

const reducers = combineReducers({ reducer, routing: routerReducer })

export default reducers
