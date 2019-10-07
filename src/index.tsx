import 'sanitize.css'
import './global.css'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

function VideoSlider(props) {
  return (
    <div className="video-slider">
      <div className="previews">
        <div className="frame"></div>
      </div>

      <div className="bg"></div>

      <div className="window">
        <div className="handle is-left">
          <div className="line"></div>
        </div>
        <div className="handle is-right">
          <div className="line"></div>
        </div>
      </div>
    </div>
  )
}

function on(el, evt, cb) {
  el.addEventListener(evt, cb)

  return () => {
    el.removeEventListener(evt, cb)
  }
}

function App() {
  return (
    <div className="app-body">
      <div className="app-container">
        <VideoSlider />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('mount'))
