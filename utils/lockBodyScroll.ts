/**
 * Holds the page where it is behind a modal, and returns what lets it go.
 * Read before showModal(), which scrolls the page to the top.
 */
const lockBodyScroll = (): (() => void) => {
  const top = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${top}px`

  let isLocked = true
  return () => {
    if (!isLocked) return
    isLocked = false
    document.body.style.position = ''
    document.body.style.top = ''
    window.scrollTo(0, top)
  }
}

export default lockBodyScroll
