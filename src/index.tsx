import 'sanitize.css'
import './global.css'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

const c = {
  ITEMS_PER_ROW: 8,
  SLIDE_WIDTH: 248,
  SLIDE_HOVER_WIDTH: 500,
  SLIDE_MARGIN: 4
}

function Slider(props) {
  const [isDragging, setIsDragging] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)
  const [slackX, internalSetSlackX] = useState(() => props.value)
  const slackXRef = useRef(props.value)
  const trackRef = useRef(null)
  const mouseMoveEventRef = useRef(null)
  const mouseUpEventRef = useRef(null)
  const touchMoveEventRef = useRef(null)
  const touchEndEventRef = useRef(null)
  const touchCancelEventRef = useRef(null)

  useEffect(() => {
    setTrackWidth(trackRef.current.getBoundingClientRect().width)
  }, [])

  function setSlackX(value) {
    internalSetSlackX(value)
    slackXRef.current = value
  }

  function change(value) {
    props.onChange && props.onChange(value)
  }

  function dragChange(value) {
    props.onDragEnd && props.onDragEnd(value)
  }

  function handleMouseDown(evt) {
    evt.preventDefault()
    setIsDragging(true)
    const value = getValueFromPosition(evt)
    setSlackX(value)
    change(value)
    mouseMoveEventRef.current = on(document, 'mousemove', handleDrag)
    mouseUpEventRef.current = on(document, 'mouseup', handleDragEnd)
    touchMoveEventRef.current = on(document, 'touchmove', handleDrag)
    touchEndEventRef.current = on(document, 'touchend', handleDragEnd)
    touchCancelEventRef.current = on(document, 'touchcancel', handleDragEnd)
  }

  function handleDrag(evt) {
    const value = getValueFromPosition(evt)
    setSlackX(value)
    change(value)
  }

  function handleDragEnd() {
    mouseMoveEventRef.current()
    mouseUpEventRef.current()
    touchMoveEventRef.current()
    touchEndEventRef.current()
    touchCancelEventRef.current()
    setIsDragging(false)
    dragChange(slackXRef.current)
  }

  function getValueFromPosition(evt) {
    const box = trackRef.current.getBoundingClientRect()
    const mouse = getClientX(evt)
    const start = box.x - mouse
    const end = box.x + box.width

    if (mouse <= start) {
      return props.min
    }

    if (mouse >= end) {
      return props.max
    }

    return (mouse / end) * props.max
  }

  function getClientX(evt) {
    return evt.touches ? evt.touches[0].clientX : evt.clientX
  }

  const value = isDragging ? slackX : props.value
  const thumbOffset = trackWidth ? (value / props.max) * trackWidth : 0
  const activeWidth = trackWidth ? trackWidth - thumbOffset : 0

  return (
    <div className="poging-range-slider" onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
      <div className="track" ref={trackRef}>
        <div className="active" style={{ width: activeWidth, transform: `translateX(${thumbOffset}px)` }}></div>
      </div>

      {Boolean(trackWidth) && (
        <div
          className="handle"
          style={{ transform: `translateX(${thumbOffset}px) ${isDragging ? 'scale(1.2)' : 'scale(1)'}` }}
        />
      )}
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
  const [x1, setX1] = useState(75)
  const [x2, setX2] = useState(50)

  return (
    <div className="app-body">
      <div className="app-container">
        <div className="app-section">
          <Slider value={x1} min={0} max={100} onChange={setX1} />
          Live update (x1: {x1})
        </div>

        <div className="app-section">
          <Slider value={x2} min={0} max={100} onDragEnd={setX2} />
          Lazy update (x2: {x2})
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('mount'))
