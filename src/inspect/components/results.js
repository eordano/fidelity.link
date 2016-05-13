import React, { Component, PropTypes } from 'react'

import { row } from '../../app/util'

export default class Results extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    action: PropTypes.func.isRequired
  };
  action (ev) {
    ev.preventDefault()
    this.props.action()
  }
  render () {
    const straighForward = (a, b) => row(a, this.props.data[b])
    return <div className='inspect-results'>
      { straighForward('Included in block', 'initialBlockHeight') }
      { straighForward('Target block height', 'targetBlockHeight') }
      { straighForward('Sacrificed satoshis', 'satoshis') }
      { straighForward('Associated address', 'associatedAddress') }
      { row('Associated public key', this.props.data.associatedPublicKey.toString()) }

      <button className='btn btn-default' onClick={this.action.bind(this)}>
        <i className='fa fa-arrow-left'></i> Clear
      </button>
    </div>
  }
}
