import { fork, take, put, call } from 'redux-saga'

import api from '../blockcypher'
import { actions } from './reducers'

import { utxoSetDiffer } from './logic'
import { wait } from '../app/util'

const INTERVAL_BETWEEN_CHECKS = 10000

export function* getBlockchainState (getState) {
  while (true) {
    const blockchainState = yield api.getBlockchainState()

    if (!getState().create.currentBlockHeight) {
      yield put(actions.setCurrentBlockHeight(blockchainState.height))
    }
    if (getState().create.feePerKb !== blockchainState.medium_fee_per_kb) {
      yield put(actions.setFeePerKb(blockchainState.medium_fee_per_kb))
    }

    yield call(wait, INTERVAL_BETWEEN_CHECKS)
  }
}

export function* fetchUtxos (getState) {
  const privateKey = getState().create.privateKey

  while (true) {
    const newUtxos = yield api.fetchOutputs(privateKey.toAddress().toString())
    const currentUtxos = getState().create.outputs

    if (utxoSetDiffer(newUtxos, currentUtxos)) {
      yield put(actions.setOutputs(newUtxos))
    }
    yield call(wait, INTERVAL_BETWEEN_CHECKS)
  }
}

export function* broadcast () {
  while (true) {
    const info = yield take('BROADCAST_TRANSACTION')
    const apiResponse = yield api.broadcastTx(info.payload)

    if (apiResponse.error) {
      yield put(actions.unableToBroadcast(apiResponse.error))
    }
    yield put(actions.broadcastedTransaction(apiResponse))
  }
}

export const saga = function* (getState) {
  yield fork(getBlockchainState.bind(null, getState))
  yield fork(fetchUtxos.bind(null, getState))
  yield fork(broadcast)
}
