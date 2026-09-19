import { useState, useEffect } from 'react'

// Locks the page behind a modal by pinning the body at the current offset, and
// puts the reader back where they were when it opens up again.
const useBodyScrollLock = (lock: boolean): void => {
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    setScrollY(window.scrollY)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (lock) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      return
    }

    // This also runs on mount, when nothing has been locked yet. There is no
    // offset to go back to then, and parseInt('') is NaN, which scrolls the
    // page to the top.
    const top = document.body.style.top
    if (!top) return

    document.body.style.position = ''
    document.body.style.top = ''
    window.scrollTo(0, parseInt(top) * -1)
  }, [lock])
}

export default useBodyScrollLock
