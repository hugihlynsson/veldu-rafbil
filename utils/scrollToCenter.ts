import prefersReducedMotion from './prefersReducedMotion'

// Anything the reader does before the scroll ends means they have moved on
const interruptions = ['wheel', 'pointerdown', 'keydown']

/**
 * Brings the element to the middle of the screen. Content under
 * content-visibility: auto stands in at an estimated size until it is drawn,
 * so what a scroll passes can change size under it and leave it short; once
 * it ends, it is aimed again.
 */
const scrollToCenter = (element: Element): void => {
  const center = () =>
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })

  const settle = new AbortController()
  const options = { once: true, passive: true, signal: settle.signal }

  window.addEventListener(
    'scrollend',
    () => {
      settle.abort()
      center()
    },
    options,
  )
  for (const type of interruptions) {
    window.addEventListener(type, () => settle.abort(), options)
  }

  // A scroll that never starts, as to an element already in place, never
  // ends either, and the correction must not fire for a later one instead
  const unstarted = setTimeout(() => settle.abort(), 200)
  window.addEventListener('scroll', () => clearTimeout(unstarted), options)

  center()
}

export default scrollToCenter
