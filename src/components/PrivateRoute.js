import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Utils from '../Utils'

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
              search: Utils.stringifyQueryString({
                redirect: props.location.pathname + props.location.search
              })
            }}
            />)}
    />
  ))
)
