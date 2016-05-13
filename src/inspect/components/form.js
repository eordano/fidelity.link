import React, { Component, PropTypes } from 'react'

export default class TxForm extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired
  };
  submit (ev) {
    ev.preventDefault()
    this.props.action(this.refs.transaction.value)
  }
  render () {
    return <form className='form'>
      <div className='form-group'>
        <label htmlFor='transaction'>Transaction hash:</label>
        <input name='transaction' ref='transaction' className='form-control'
               defaultValue='e60a8e6e4498468bf71ebdc257500b80a24fb034974b13eb0cdc60a8a4960e24'/>
      </div>
      <div className='form-group'>
        <button
          onClick={this.submit.bind(this)}
          className='btn btn-primary'
        >
          <i className='fa fa-search'></i> Go
        </button>
      </div>
    </form>
  }
}
