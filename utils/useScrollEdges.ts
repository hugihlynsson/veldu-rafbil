import { useState } from 'react'

/**
 * Whether a scroller has been moved off its top, and whether it can still go
 * further down: the line under a header shows only once something has gone
 * under it, and the one over a footer only while something is still below it.
 * Returns a ref callback for the scroller along with the two.
 */
const useScrollEdges = () => {
  const [scrolled, setScrolled] = useState(false)
  const [atEnd, setAtEnd] = useState(true)

  const ref = (scroller: HTMLElement | null) => {
    if (!scroller) return

    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller
      setScrolled(scrollTop > 0)
      // A pixel of slack, as a zoomed page leaves scrollTop fractional
      setAtEnd(scrollTop + clientHeight >= scrollHeight - 1)
    }

    measure()
    scroller.addEventListener('scroll', measure, { passive: true })
    // The scroller resizes with the keyboard, and what is in it can grow
    // without a scroll event
    const resizes = new ResizeObserver(measure)
    resizes.observe(scroller)
    for (const child of scroller.children) resizes.observe(child)

    return () => {
      scroller.removeEventListener('scroll', measure)
      resizes.disconnect()
    }
  }

  return { ref, scrolled, atEnd }
}

export default useScrollEdges
