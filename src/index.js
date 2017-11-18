import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

window.electron = window.require && window.require('electron')

const root = document.getElementById('root')

if (!window.electron) {
  ReactDOM.render(<p>Please use electron to visit this App</p>, root)
} else {
  ReactDOM.render(<App />, root)
}
