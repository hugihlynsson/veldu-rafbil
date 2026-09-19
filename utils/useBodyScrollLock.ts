import { useEffect, useRef } from 'react'

// Locks the page behind a modal by pinning the body at the current offset, and
// puts the reader back where they were when it opens up again.
//
// The offset has to be tracked on the way past rather than read when the lock
// goes on. A modal is a child, child effects run before parent ones, and
// showModal() scrolls the page to the top on the way — so by the time this
// hook runs, window.scrollY is already 0 and the reader has lost their place.
//
// It is a ref rather than state because it is only ever read here. As state it
// re-rendered the whole car list on every scroll event.
const useBodyScrollLock = (lock: boolean): void => {
  const scrollY = useRef(0)

  useEffect(() => {
    if (lock) return

    scrollY.current = window.scrollY
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lock])

  useEffect(() => {
    if (!lock) return

    const top = scrollY.current
    document.body.style.position = 'fixed'
    document.body.style.top = `-${top}px`

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      window.scrollTo(0, top)
    }
  }, [lock])
}

export default useBodyScrollLock
