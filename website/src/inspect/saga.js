import { take, put } from 'redux-saga'

import api from '../blockcypher'
import { actions } from './reducers'

export function* saga () {
  while (true) {
    const info = yield take('SEARCH_TX')
    put(actions.fetchingTx())

    const apiResponse = yield api.fetchTx(info.payload)

    if (apiResponse.error) {
      yield put(actions.txNotFound())
    } else {
      yield put(actions.processTxData(apiResponse))
    }
  }
}
