import { fork } from 'redux-saga'
import { saga as inspectSaga } from './inspect/saga'
import { saga as createSaga } from './create/saga'

export default function* root (getState) {
  yield fork(inspectSaga)
  yield fork(createSaga.bind(null, getState))
}
