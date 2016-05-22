import fetch from 'isomorphic-fetch'
import bitcore from 'bitcore-lib'
import _ from 'lodash'

const BLOCKCHAIN_URL_MAIN = 'https://api.blockcypher.com/v1/btc/main'
const UNSPENT_ONLY = 'unspentOnly'
const INCLUDE_SCRIPT = 'includeScript'

function returnJsonBody (res) {
  return res.json()
}

function fetchJson () {
  return fetch.apply(this, arguments).then(returnJsonBody)
}

function makeTxUrl (txId) {
  return BLOCKCHAIN_URL_MAIN + '/txs/' + txId
}

function fetchTx (txId) {
  return fetchJson(makeTxUrl(txId))
}

function makeAddressUrl (address) {
  const opts = [UNSPENT_ONLY, INCLUDE_SCRIPT]
  const urlEncodedOpts = '&'.join(opts.map(opt => opt + '=true'))
  return `${BLOCKCHAIN_URL_MAIN}/addrs/${address}?${urlEncodedOpts}`
}

function fetchAddressInfo (address) {
  return fetchJson(makeAddressUrl(address))
}

function getBlockchainState () {
  return fetchJson(BLOCKCHAIN_URL_MAIN)
}

function getMaybeArray (array) {
  return _.isArray(array) ? array : []
}

function broadcastTx (tx) {
  return fetchJson(BLOCKCHAIN_URL_MAIN + '/txs/push', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: { tx: tx.toString() }
  })
}

function blockcypherToBitcoreOutputFormat (output) {
  return {
    txId: output.tx_hash,
    outputIndex: output.tx_output_n,
    satoshis: output.value,
    script: output.script
  }
}

function processAddressInfoIntoOutputs (rawInfo) {
  const txs = getMaybeArray(rawInfo.txrefs)
  const unconfirmed = getMaybeArray(rawInfo.unconfirmed_txrefs)

  return _.concat(txs, unconfirmed)
    .map(blockcypherToBitcoreOutputFormat)
    .map(bitcore.Transaction.UnspentOutput)
}

function fetchOutputs (address) {
  return fetchAddressInfo(address).then(processAddressInfoIntoOutputs)
}

export default {
  BLOCKCHAIN_URL_MAIN,

  returnJsonBody,
  getMaybeArray,

  makeTxUrl,
  fetchTx,

  makeAddressUrl,
  fetchAddressInfo,

  getBlockchainState,

  broadcastTx,

  blockcypherToBitcoreOutputFormat,
  processAddressInfoIntoOutputs,
  fetchOutputs
}
