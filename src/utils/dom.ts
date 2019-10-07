import * as React from 'react'

type EventCallback = (evt: React.SyntheticEvent<HTMLElement>) => void
type EventSink = () => void

export function on(el: Element | Document, evt: string, cb: EventCallback): EventSink {
  el.addEventListener(evt, cb)

  return () => {
    el.removeEventListener(evt, cb)
  }
}