import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import qs from 'qs'

export default observer(({ component: Component, isLogin, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isLogin
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/login',
            search: qs.stringify({
              redirect: props.location.pathname + props.location.search
            })
          }}
          />)}
  />
))
