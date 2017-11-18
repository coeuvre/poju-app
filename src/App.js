import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

class App extends React.Component {
  constructor () {
    super()

    extendObservable(this, {
      app: { isLogin: false }
    })
  }
  render () {
    return (
      <div style={{ height: '100%' }}>
        <Router>
          <Switch>
            <Route
              path='/login'
              exact
              component={() => <Login app={this.app} />}
            />
            <PrivateRoute app={this.app} path='/' exact component={Dashboard} />
          </Switch>
        </Router>

        <DevTools />
      </div>
    )
  }
}

export default observer(App)
