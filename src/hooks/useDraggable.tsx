import * as React from 'react'
import { useRef, useEffect } from 'react'
import { on } from '~/utils/dom'

interface DragData {
  start: number
  movement: number
}

interface Props {
  ref: React.RefObject<HTMLDivElement>
  containerRef: React.RefObject<HTMLDivElement>
  onDragStart?: (evt: MouseEvent) => void
  onDragMove?: (evt: MouseEvent, data: DragData) => void
  onDragEnd?: (evt: MouseEvent) => void
}

function useDraggable(props: Props) {
  const dragStartRef = useRef(() => {})
  const dragEndRef = useRef(() => {})
  const startingMousePosition = useRef(0)
  const startingElementPosition = useRef(0)

  useEffect(() => {
    return () => {
      dragStartRef.current()
      dragEndRef.current()
    }
  }, [])

  function handleDragStart(evt) {
    startingMousePosition.current = evt.clientX
    const box = props.ref.current.getBoundingClientRect()
    const container = props.containerRef.current.getBoundingClientRect()
    startingElementPosition.current = box.left - container.left
    props.onDragStart && props.onDragStart(evt)
    dragStartRef.current = on(document, 'mousemove', handleDragMove)
    dragEndRef.current = on(document, 'mouseup', handleDragEnd)
  }

  function handleDragMove(evt) {
    props.onDragMove && props.onDragMove(evt, {
      start: startingElementPosition.current,
      movement: evt.clientX - startingMousePosition.current
    })
  }

  function handleDragEnd(evt) {
    dragStartRef.current()
    dragEndRef.current()
    props.onDragEnd && props.onDragEnd(evt)
  }

  return { onMouseDown: handleDragStart }
}

export { useDraggable }