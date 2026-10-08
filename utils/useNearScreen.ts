import { RefObject, useEffect, useState } from 'react'

const listeners = new Map<Element, (near: boolean) => void>()
let observer: IntersectionObserver | undefined

const watch = (element: Element, onChange: (near: boolean) => void) => {
  // One observer for every card rather than one each. Half a screen either
  // side, so a card about to scroll in is already near.
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        listeners.get(entry.target)?.(entry.isIntersecting)
    },
    { rootMargin: '50% 0px' },
  )
  listeners.set(element, onChange)
  observer.observe(element)
  return () => {
    listeners.delete(element)
    observer?.unobserve(element)
  }
}

/** Whether the element is on screen, or within half a screen of it */
const useNearScreen = (ref: RefObject<Element | null>): boolean => {
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    return watch(ref.current, setNear)
  }, [ref])

  return near
}

export default useNearScreen
