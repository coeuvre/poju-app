import React from 'react'
import { Redirect } from 'react-router-dom'
import { extendObservable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import JuApi from '../JuApi'

const juEntry = 'https://freeway.ju.taobao.com/'

export default inject('store')(
  observer(
    class Page extends React.Component {
      constructor () {
        super()

        extendObservable(this, {
          display: false,

          showWebview: action(() => {
            this.display = true
          }),

          setLogin: action(() => {
            this.props.store.ui.isLogin = true
          })
        })
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

        if (webview) {
          webview.addEventListener('did-finish-load', this.didFinishLoad)
        }
      }

      render () {
        if (this.props.store.ui.isLogin) {
          return <Redirect to='/' />
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
  )
)
