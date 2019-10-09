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
  const initialWidthFromDuration = useRef<number>(0)
  const initialLeftPosition = useRef<number>(0)
  const initialRightPosition = useRef<number>(0)
  const isLeftHandleUnderbounds = useRef<boolean>(false)
  const lastStartPosition = useRef<number>(0)

  const glassDraggableProps = useDraggable({
    ref: windowRef,
    containerRef: containerRef,
    onDragMove(evt, data) {
      const start = getStartValueFromMovement(evt, data)
      props.onChangeStart(start)
    }
  })

  const rightHandleDraggableProps = useDraggable({
    ref: windowRef,
    containerRef: containerRef,
    onDragStart(evt) {
      initialWidthFromDuration.current = getWindowWidthFromDurationValue(props.duration)
    },
    onDragMove(evt, data) {
      const duration = getDurationFromMovement(evt, data)
      props.onChangeDuration(duration)
    }
  })

  const leftHandleDraggableProps = useDraggable({
    ref: windowRef,
    containerRef: containerRef,
    onDragStart(evt) {
      const left = getWindowOffsetFromStartValue(props.start)
      const width = getWindowWidthFromDurationValue(props.duration)
      initialLeftPosition.current = left
      initialRightPosition.current = left + width
      initialWidthFromDuration.current = width
      isLeftHandleUnderbounds.current = false
    },
    onDragMove(evt, data) {
      // @TODO Cannot go further than `initialLeftPosition`
      const start = getStartValueFromMovement(evt, data)
      const left = getWindowOffsetFromStartValue(start)
      const width = (initialRightPosition.current - left)
      const duration = getDurationFromWidth(width)
      props.onChangeStart(start)
      props.onChangeDuration(duration)
    }
  })

  function getDurationFromMovement(evt, data) {
    const width = initialWidthFromDuration.current + data.movement

    if (isOverbounds(data.start, width)) {
      return getMaxDurationValue(data.start)
    }

    return (width / c.CONTAINER_WIDTH) * props.video.duration
  }

  function getStartValueFromMovement(evt, data) {
    const left = data.start + data.movement

    // If we're exiting the container to the left
    if (left <= 0) {
      return 0
    }

    const width = getWindowWidthFromDurationValue(props.duration)

    // If we're exiting the container to the right
    if (isOverbounds(left, width)) {
      return getMaxStartValue(width)
    }

    return (left / c.CONTAINER_WIDTH) * props.video.duration
  }

  function getDurationFromWidth(width: number) {
    return (width / c.CONTAINER_WIDTH) * props.video.duration
  }

  function getMaxDurationValue(left: number) {
    return ((c.CONTAINER_WIDTH - left) / c.CONTAINER_WIDTH) * props.video.duration
  }

  function getMaxStartValue(width: number) {
    return ((c.CONTAINER_WIDTH - width) / c.CONTAINER_WIDTH) * props.video.duration
  }

  function isOverbounds(left: number, width: number) {
    return left + width >= c.CONTAINER_WIDTH
  }

  function getWindowWidthFromDurationValue(duration: number) {
    return ((duration + props.start) / props.video.duration) * c.CONTAINER_WIDTH - offset
  }

  function getWindowOffsetFromStartValue(start: number) {
    return (start / props.video.duration) * c.CONTAINER_WIDTH
  }

  const offset = getWindowOffsetFromStartValue(props.start)
  const width = getWindowWidthFromDurationValue(props.duration)

  return (
    <React.Fragment>
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
          <div {...leftHandleDraggableProps} className="handle is-left">
            <div className="line"></div>
          </div>
          <div {...glassDraggableProps} className="glass"></div>
          <div {...rightHandleDraggableProps} className="handle is-right">
            <div className="line"></div>
          </div>
        </div>
      </div>

      <pre>{JSON.stringify({ start: props.start, duration: props.duration })}</pre>
    </React.Fragment>
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
