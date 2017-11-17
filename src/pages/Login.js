import React from 'react'

const { ipcRenderer } = window.require('electron')

const juEntry = 'https://freeway.ju.taobao.com/'
const juPartition = 'persist:ju'

export default class Page extends React.Component {
  didFinishLoad = () => {
    const webview = this.refs.webview

    if (webview.getURL().startsWith(juEntry)) {
      console.log('Login successful!')
      ipcRenderer.send('LoginSuccess', juPartition)
      // const cookies = session.fromPartition(juPartition).cookies
      // console.log(cookies)
    }
  }

  componentDidMount () {
    const webview = this.refs.webview

    webview.addEventListener('did-finish-load', this.didFinishLoad)
  }

  render () {
    return (
      <webview
        ref='webview'
        src={juEntry}
        style={{ width: '100%', height: '100%' }}
        partition={juPartition}
      />
    )
  }
}
