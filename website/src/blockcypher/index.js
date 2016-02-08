import fetch from 'isomorphic-fetch'
import bitcore from 'bitcore-lib'
import _ from 'lodash'

export default {
  fetchTx: tx => {
    return fetch('https://api.blockcypher.com/v1/btc/main/txs/' + tx)
      .then(res => res.json())
  },

  getBlockchainState: () => {
    return fetch('https://api.blockcypher.com/v1/btc/main')
      .then(res => res.json())
  },

  fetchOutputs: addressStr => {
    return fetch('https://api.blockcypher.com/v1/btc/main/addrs/' +
                 addressStr + '?unspentOnly=true&includeScript=true')
    .then(res => res.json())
    .then(rawOutputs => {
      const txs = _.isArray(rawOutputs.txrefs) ? rawOutputs.txrefs : []
      const unconfirmed = _.isArray(rawOutputs.unconfirmed_txrefs) ? rawOutputs.unconfirmed_txrefs : []

      return _.concat(txs, unconfirmed).map(output => new bitcore.Transaction.UnspentOutput({
        txId: output.tx_hash,
        outputIndex: output.tx_output_n,
        satoshis: output.value,
        script: output.script
      }))
    })
  },

  broadcastTx: tx => {
    return fetch('https://api.blockcypher.com/v1/btc/main/txs/push', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        tx: tx.toString()
      }
    }).then(res => res.json())
  }
}
