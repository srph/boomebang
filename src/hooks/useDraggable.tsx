import * as React from 'react'
import { useRef, useEffect } from 'react'
import { on } from '~/utils/dom'

interface DragData {
  movement: number
}

interface Props {
  onDragStart?: (evt: MouseEvent<HTMLElement>) => void
  onDragMove?: (evt: MouseEvent<HTMLElement>, data: DragData) => void
  onDragEnd?: (evt: MouseEvent<HTMLElement>) => void
}

function useDraggable(props: Props) {
  const dragStartRef = useRef(() => {})
  const dragEndRef = useRef(() => {})
  const startingPosition = useRef(0)

  useEffect(() => {
    return () => {
      dragStartRef.current()
      dragEndRef.current()
    }
  }, [])

  function handleDragStart(evt) {
    startingPosition.current = evt.clientX
    props.onDragStart && props.onDragStart(evt)
    dragStartRef.current = on(document, 'mousemove', handleDragMove)
    dragEndRef.current = on(document, 'mouseup', handleDragEnd)
  }

  function handleDragMove(evt) {
    props.onDragMove && props.onDragMove(evt, {
      movement: evt.clientX - startingPosition.current
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