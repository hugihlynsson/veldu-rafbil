/**
 * Runs once the page has loaded and the browser is next idle, for chunks
 * fetched ahead of need that should not share the bandwidth the first paint is
 * waiting on. Safari has no requestIdleCallback, so a timeout stands in.
 * Returns what cancels it.
 */
const afterLoad = (run: () => void): (() => void) => {
  let cancelIdle = () => {}

  const whenIdle = () => {
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(run, { timeout: 2000 })
      cancelIdle = () => window.cancelIdleCallback(handle)
    } else {
      const handle = window.setTimeout(run, 200)
      cancelIdle = () => window.clearTimeout(handle)
    }
  }

  if (document.readyState === 'complete') {
    whenIdle()
    return () => cancelIdle()
  }

  window.addEventListener('load', whenIdle, { once: true })
  return () => {
    window.removeEventListener('load', whenIdle)
    cancelIdle()
  }
}

export default afterLoad
