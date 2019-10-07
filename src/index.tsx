import 'sanitize.css'
import './global.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState, useRef, useEffect } from 'react'
import { useDraggable } from '~/hooks/useDraggable'
import sample from './assets/sample.mp4'

interface VideoSliderProps {
  start: number
  duration: number
  video: {
    url: string
    duration: number
  }
  onChangeStart: (start: number) => void
  onChangeDuration: (duration: number) => void
}

const c = {
  CONTAINER_WIDTH: 768 - 32,
  MIN_DURATION: 2
}

function VideoSlider(props: VideoSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const glassDraggableProps = useDraggable({
    onDragMove(evt, data) {
      const start = getStartPosition(evt, data)
      props.onChangeStart(start)
    }
  })

  function getStartPosition(evt, data) {
    const box = containerRef.current.getBoundingClientRect()
    const position = data.movement - box.left

    if (position <= 0) {
      return 0
    }
    
    return (position / c.CONTAINER_WIDTH) * props.video.duration
  }

  function getStartValueFromOffset(movement: number) {
    const box = containerRef.current.getBoundingClientRect()
    const position = data.movement - box.left
  }

  function getOffsetFromValue() {
    return (props.start / props.video.duration) * c.CONTAINER_WIDTH
  }

  console.log('here 2')

  const offset = (props.start / props.video.duration) * c.CONTAINER_WIDTH
  const width = (((props.duration + props.start) / props.video.duration) * c.CONTAINER_WIDTH - offset)

  return (
    <div className="video-slider" ref={containerRef}>
      <div className="previews">
        <div className="frame"></div>
      </div>

      <div className="bg"></div>

      <div
        ref={windowRef}
        className="window"
        style={{
          width,
          transform: `translateX(${offset}px)`
        }}>
        <div className="handle is-left">
          <div className="line"></div>
        </div>
        <div {...glassDraggableProps} className="glass"></div>
        <div className="handle is-right">
          <div className="line"></div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const video = {
    url: sample,
    duration: 4.0
  }

  const [start, setStart] = useState<number>(0)
  const [duration, setDuration] = useState<number>(2)

  return (
    <div className="app-body">
      <div className="app-container">
        <video muted autoPlay loop className="video-looper">
          <source src={video.url} type="video/mp4" />
        </video>

        <VideoSlider
          start={start}
          duration={duration}
          video={video}
          onChangeStart={setStart}
          onChangeDuration={setDuration}
        />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('mount'))
