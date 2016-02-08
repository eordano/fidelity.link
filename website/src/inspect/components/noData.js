import React, { Component, PropTypes } from 'react'

export default class NoData extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired
  };

  submit (ev) {
    ev.preventDefault()
    this.props.action()
  }

  render () {
    return <div id='no-results' className='hidden'>
      <h4>No results found. Please try a different address</h4>
      <button className='btn btn-default' onClick={this.submit.bind(this)}>
        <i className='fa fa-arrow-left'></i> Back
      </button>
    </div>
  }
}
