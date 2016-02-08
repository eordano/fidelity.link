import bitcore from 'bitcore-lib'

const MAGIC = new Buffer('https://fidelity.link/')

export const findRedeemDataIndex = txData => {
  let redeemIndex = -1
  let script
  txData.outputs.forEach((output, index) => {
    if (output.script_type === 'null-data') {
      script = new bitcore.Script(new bitcore.Script(output.data_hex))

      if (script.chunks.length !== 4) return
      if (!script.chunks[0].buf) return
      if (script.chunks[0].buf.compare(MAGIC)) return
      if (!script.chunks[1].buf) return
      if (script.chunks[2].opcodenum !== bitcore.Opcode.OP_CHECKLOCKTIMEVERIFY) return
      if (script.chunks[3].opcodenum !== bitcore.Opcode.OP_DROP) return

      redeemIndex = index
    }
  })
  return redeemIndex
}

export const findSacrificeOutput = (txData, address) => {
  let sacrificeIndex = -1
  txData.outputs.forEach((output, index) => {
    if (output.script_type === 'pay-to-script-hash') {
      if (output.addresses && output.addresses.length > 0) {
        if (output.addresses[0] === address) {
          sacrificeIndex = index
        }
      }
    }
  })
  return sacrificeIndex
}

export const getFidelityParams = (txData) => {
  const blockHeight = txData.block_height
  if (!blockHeight) {
    return null
  }

  const redeemIndex = findRedeemDataIndex(txData)
  if (redeemIndex === -1) {
    return null
  }

  const redeemScript = new bitcore.Script(
    new bitcore.Script(txData.outputs[redeemIndex].script).chunks[1].buf
  )
  const finalTargetHeight = bitcore.crypto.BN.fromScriptNumBuffer(redeemScript.chunks[1].buf).toNumber()

  const redeemAddress = new bitcore.Address(bitcore.Script.buildScriptHashOut(redeemScript)).toString()

  const sacrificeIndex = findSacrificeOutput(txData, redeemAddress)
  if (sacrificeIndex === -1) {
    return null
  }
  const sacrificeSatoshis = txData.outputs[sacrificeIndex].value

  const firstAddress = txData.inputs.reduce((prev, next) => prev || next.addresses[0], null)
  const firstPublicKey = txData.inputs.reduce((prev, next) => {
    if (prev) {
      return prev
    }
    if (next.script_type === 'pay-to-pubkey-hash') {
      return new bitcore.PublicKey(new bitcore.Script(next.script).chunks[1].buf)
    }
  }, null)

  return {
    script: redeemScript,
    initialBlockHeight: blockHeight,
    initialBlockHash: txData.block_hash,
    targetBlockHeight: finalTargetHeight,
    satoshis: sacrificeSatoshis,
    associatedAddress: firstAddress,
    associatedPublicKey: firstPublicKey
  }
}
