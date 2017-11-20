import React from 'react'
import { Redirect } from 'react-router-dom'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import Utils from '../Utils'
import JuApi from '../JuApi'

const juEntry = 'https://freeway.ju.taobao.com/'

@inject('store')
@observer
class Page extends React.Component {
  @observable display = false

  @action showWebview = () => {
    this.display = true
  }

  @action setLogin = () => {
    this.props.store.ui.isLogin = true
  }

  didFinishLoad = () => {
    const webview = this.refs.webview

    if (webview.getURL().startsWith(juEntry)) {
      console.log('Login successfully!')
      window.electron.ipcRenderer.send('LoginSuccess', JuApi.partition)

      this.setLogin()
    } else {
      this.showWebview()
    }
  }

  componentDidMount () {
    const webview = this.refs.webview

    webview.addEventListener('did-finish-load', this.didFinishLoad)
  }

  render () {
    const { location } = this.props

    if (this.props.store.ui.isLogin) {
      const query = Utils.parseQueryString(location.search)
      const to = query.redirect || '/'
      return <Redirect to={to} />
    }

    return (
      <div>
        {!this.display && <p>Logining...</p>}
        <webview
          ref='webview'
          src={juEntry}
          style={{
            opacity: this.display ? 1 : 0,
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
          partition={JuApi.partition}
        />
      </div>
    )
  }
}

export default Page
