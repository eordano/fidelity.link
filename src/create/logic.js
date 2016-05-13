import _ from 'lodash'

export const utxoSetDiffer = (a, b) => {
  if (a.length !== b.length) {
    return true
  }
  const outputs = {}
  _.forEach(a, output => outputs[a.txId + ':' + a.outputIndex] += 1)
  _.forEach(a, output => outputs[a.txId + ':' + a.outputIndex] -= 1)
  return _.some(outputs, (key, value) => value !== 0)
}
