import definer from '../app/redux/definer'

import { getFidelityParams } from './logic'

const { reduce, exportInitialState } = definer(module.exports)
const update = (a, b) => Object.assign({}, a, b)

reduce('SEARCH_TX', state => {
  return state
})

reduce('FETCHING_TX', state => update(state, {
  fetching: true
}))

reduce('TX_NOT_FOUND', state => update(state, {
  fetching: false,
  txData: null
}))

reduce('PROCESS_TX_DATA', (state, { payload }) => {
  const data = getFidelityParams(payload)
  if (data !== null) {
    return update(state, { txData: data })
  }
  return state
})

reduce('CLEAR_DATA', state => update(state, { txData: null }))

export default exportInitialState({
  fetching: false,
  txData: null
})

