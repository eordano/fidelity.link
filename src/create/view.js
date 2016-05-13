import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { row as makeRow } from '../app/util'
import { actions } from './reducers'

class CreateView extends React.Component {
  static propTypes = {
    privateKey: PropTypes.object.isRequired,
    outputs: PropTypes.array.isRequired,
    targetBlockHeight: PropTypes.number,
    currentBlockHeight: PropTypes.number,
    transaction: PropTypes.object,

    broadcasting: PropTypes.object,
    broadcasted: PropTypes.object,

    setTargetBlockHeight: PropTypes.func.isRequired,
    broadcastTransaction: PropTypes.func.isRequired
  };

  privateKeyInfo () {
    return <div>
      { makeRow('Using private key', this.props.privateKey.toString()) }
      { makeRow('Address', this.props.privateKey.toAddress().toString()) }
    </div>
  }

  detectedOutputs () {
    return makeRow('Outputs detected', this.props.transaction.inputs.length)
  }

  setTargetBlockHeight () {
    this.props.setTargetBlockHeight(parseInt(this.refs.targetBlockHeight.value, 10))
  }

  targetBlockHeight () {
    if (!this.props.currentBlockHeight) {
      return ''
    }
    return <div>
      { makeRow('Current block height', this.props.currentBlockHeight) }
      { makeRow('Target block height', <div> <input
          className='form-control target-height'
          ref='targetBlockHeight'
          type='number'
          defaultValue={this.props.targetBlockHeight}
          onChange={this.setTargetBlockHeight.bind(this)}
        /> ({ this.props.targetBlockHeight - this.props.currentBlockHeight } blocks)</div>)
      }
    </div>
  }

  transactionInfo () {
    if (!this.props.transaction) {
      return ''
    }
    return <div>
      { makeRow('Resulting transaction hash', this.props.transaction.hash) }
      { makeRow('Resulting transaction',
                <textarea readOnly
                          className='form-control text-area'
                          value={this.props.transaction.toString()} />)
      }
    </div>
  }

  submit (ev) {
    ev.preventDefault()
    this.props.broadcastTransaction(this.props.transaction)
  }

  sendButton () {
    if (!this.props.transaction) {
      return
    }
    if (this.props.broadcasting) {
      return <p>Broadcasting transaction...</p>
    }
    if (this.props.broadcasted) {
      return <p>Transaction broadcasted: <a
        href={'https://live.blockcypher.com/btc/tx/' + this.props.broadcasted.hash + '/'}
      >see on block explorer</a></p>
    }
    return <p>
      <button className='btn btn-primary' onClick={this.submit.bind(this)}>Send</button>
    </p>
  }

  render () {
    return <div className='create-partial'>
      { this.privateKeyInfo() }
      { this.detectedOutputs() }
      { this.targetBlockHeight() }
      { this.transactionInfo() }
      { this.sendButton() }
    </div>
  }
}

export default connect(state => state.create, actions)(CreateView)
