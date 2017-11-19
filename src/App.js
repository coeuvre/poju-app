import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RootStore from './stores/index'

const Routes = () => (
  <Router>
    <Switch>
      <Route path='/login' exact component={Login} />
      <PrivateRoute path='/' exact component={Dashboard} />
    </Switch>
  </Router>
)

class App extends React.Component {
  render () {
    return (
      <div>
        <Routes />
        <DevTools />
      </div>
    )
  }
}

const Root = () => (
  <Provider store={new RootStore()}>
    <App />
  </Provider>
)

export default Root
