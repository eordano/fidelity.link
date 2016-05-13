import React from 'react'
import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { actions as simpleActions } from './reducers'
import actions from './actions'

import TxForm from './components/form'
import NoData from './components/noData'
import Results from './components/results'

class InspectView extends Component {

  static propTypes = {
    txData: PropTypes.object,
    fetching: PropTypes.bool.isRequired,
    searchTx: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired
  };

  form () {
    return <TxForm action={this.props.searchTx} />
  }

  noData () {
    return <NoData />
  }

  loading () {
    return <div> <h4>Loading... please wait</h4> </div>
  }

  results () {
    return <Results data={this.props.txData}
      action={this.props.clearData.bind(this)}
    />
  }

  render () {
    if (!this.props.txData && !this.props.fetching) {
      return this.form()
    }
    if (this.props.fetching) {
      return this.loading()
    }
    if (this.props.txData) {
      return this.results()
    }
    return this.noData()
  }
}

const mapStateToProps = state => state.inspect

export default connect(mapStateToProps, _.merge({}, actions, simpleActions))(InspectView)
