import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'

import inspect from './inspect/reducers'
import create from './create/reducers'

export default combineReducers({
  inspect,
  create,
  router
})
