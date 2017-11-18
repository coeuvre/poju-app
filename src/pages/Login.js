import React from 'react'
import { Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'

import Utils from '../Utils'

const juEntry = 'https://freeway.ju.taobao.com/'

class Page extends React.Component {
  didFinishLoad = () => {
    const webview = this.refs.webview

    if (webview.getURL().startsWith(juEntry)) {
      window.electron.ipcRenderer.send('LoginSuccess', Utils.juParition)

      this.props.isLogin = true
    }
  }

  componentDidMount () {
    const webview = this.refs.webview

    if (webview) {
      webview.addEventListener('did-finish-load', this.didFinishLoad)
    }
  }

  render () {
    if (this.props.isLogin) {
      return <Redirect to='/' />
    }

    return (
      <webview
        ref='webview'
        src={juEntry}
        style={{ width: '100%', height: '100%' }}
        partition={Utils.juParition}
      />
    )
  }
}

export default observer(Page)
