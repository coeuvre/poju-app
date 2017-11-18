import React from 'react'

const juEntry = 'https://freeway.ju.taobao.com/'
const juPartition = 'persist:ju'

export default class Page extends React.Component {
  didFinishLoad = () => {
    const webview = this.refs.webview

    if (webview.getURL().startsWith(juEntry)) {
      console.log('Login successful!')
      window.electron.ipcRenderer.send('LoginSuccess', juPartition)
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
