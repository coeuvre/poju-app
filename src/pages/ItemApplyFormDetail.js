import React from 'react'
import PropTypes from 'prop-types'

import JuApi from '../JuApi'

class Page extends React.Component {
  static propTypes = {
    juId: PropTypes.string.isRequired
  }

  render () {
    const { juId } = this.props

    return (
      <webview
        ref='webview'
        src={`https://freeway.ju.taobao.com/tg/itemApplyFormDetail.htm?juId=${juId}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
        partition={JuApi.partition}
      />
    )
  }
}

export default Page
