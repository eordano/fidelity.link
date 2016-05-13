import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import CoreLayout from 'app/CoreLayout'
import IndexView from 'main/view'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={IndexView} />
    <Redirect from='*' to='/' />
  </Route>
)
