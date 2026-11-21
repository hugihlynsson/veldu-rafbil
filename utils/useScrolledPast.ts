import { useEffect, useRef, useState } from 'react'

/** Whether the element has scrolled up out of view, and the ref to watch it by */
export default function useScrolledPast<T extends Element>() {
  const ref = useRef<T>(null)
  const [past, setPast] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    // Out of view below the fold is not past it
    const observer = new IntersectionObserver(([entry]) => {
      if (entry)
        setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, past }
}
