import { useEffect, useRef } from 'react'

// Tracks the offset on the way past rather than reading it when the lock goes
// on: showModal() has already scrolled the page to the top by then.
const useBodyScrollLock = (lock: boolean): void => {
  // A ref: as state, every scroll event would re-render the whole car list
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
