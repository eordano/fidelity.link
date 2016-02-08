import React from 'react'

import InspectView from '../inspect/view'
import CreateView from '../create/view'

export default class IndexView extends React.Component {
  render () {
    return <div>
      <h3>Validate a Fidelity Bond</h3>
      <InspectView />
      <h3>Create a Fidelity Bond</h3>
      <CreateView />
    </div>
  }
}
