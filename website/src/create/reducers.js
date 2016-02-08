import definer from '../app/redux/definer'
import bitcore from 'bitcore-lib'

let privateKey

const { reduce, exportInitialState } = definer(module.exports)

const update = (a, b) => Object.assign({}, a, b)

const MAGIC_DEFAULT_BLOCK_SPAN = 2030
const MAGIC_NUMBER = new Buffer('https://fidelity.link/')

const buildRedeem = targetBlockHeight => new bitcore.Script()
  .add(MAGIC_NUMBER)
  .add(bitcore.crypto.BN.fromNumber(targetBlockHeight).toScriptNumBuffer())
  .add(bitcore.Opcode.OP_CHECKLOCKTIMEVERIFY)
  .add(bitcore.Opcode.OP_DROP)

const getAddressFromRedeem = redeemScript => new bitcore.Address(
  bitcore.Script.buildScriptHashOut(redeemScript)
)

if (window && window.localStorage) {
  privateKey = window.localStorage.getItem('privateKey')
  if (!privateKey) {
    privateKey = new bitcore.PrivateKey()
    window.localStorage.setItem('privateKey', privateKey.toString())
  } else {
    privateKey = new bitcore.PrivateKey(privateKey)
  }
}

reduce('SET_CURRENT_BLOCK_HEIGHT', (state, { payload }) => {
  const targetBlockHeight = state.targetBlockHeight || (payload + MAGIC_DEFAULT_BLOCK_SPAN)
  return update(state, { currentBlockHeight: payload, targetBlockHeight })
})

reduce('SET_OUTPUTS', (state, { payload }) => {
  const newTx = new bitcore.Transaction(state.transaction)
  newTx.removeAllInputs()
  newTx.from(payload)
  newTx.sign(privateKey)
  return update(state, { transaction: newTx })
})

reduce('SET_FEE_PER_KB', (state, { payload }) => {
  const newTx = new bitcore.Transaction(state.transaction)
  newTx.feePerKb(payload)
  newTx.sign(privateKey)
  return update(state, { transaction: newTx })
})

reduce('SET_TARGET_BLOCK_HEIGHT', (state, { payload }) => {
  const tx = new bitcore.Transaction(state.transaction)
  tx.clearOutputs()

  const redeemScript = buildRedeem(payload)
  tx.change(getAddressFromRedeem(redeemScript))
  tx.addData(redeemScript.toBuffer())
  tx.sign(privateKey)

  return update(state, { transaction: tx, targetBlockHeight: payload })
})

reduce('BROADCAST_TRANSACTION', state => update(state, {
  broadcastingError: null,
  broadcasting: state.transaction
}))

reduce('BROADCASTED_TRANSACTION', (state, { payload }) => update(state, {
  broadcasting: null,
  broadcasted: payload
}))

reduce('UNABLE_TO_BROADCAST', (state, { payload }) => update(state, {
  broadcasting: null,
  broadcasted: null,
  broadcastingError: payload
}))

export default exportInitialState({
  privateKey: privateKey,
  outputs: [],
  targetBlockHeight: 0,
  currentBlockHeight: 0,
  feePerKb: null,
  transaction: new bitcore.Transaction(),
  broadcasting: null,
  broadcasted: null
})
