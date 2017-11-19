import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import qs from 'qs'

export default inject('store')(
  observer(({ store, component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        (store.ui.isLogin
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
)
