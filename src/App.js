import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import PrivateRoute from './components/PrivateRoute'
import Ipc from './Ipc'
import Utils from './Utils'

import LoginPage from './pages/Login'

class App extends React.Component {
  isLogin = observable.box(false)

  render () {
    const isLogin = this.isLogin

    return (
      <div style={{ height: '100%' }}>
        <Router>
          <Switch>
            <Route
              path='/login'
              exact
              component={() => <LoginPage isLogin={isLogin} />}
            />
            <PrivateRoute
              isLogin={isLogin}
              path='/'
              exact
              component={() => <p>LLL</p>}
            />
          </Switch>
        </Router>

        <DevTools />
      </div>
    )
  }
}

export default observer(App)
