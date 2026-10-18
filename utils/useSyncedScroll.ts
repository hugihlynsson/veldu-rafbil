import { useRef } from 'react'

const DRIVING = 'driving'

/**
 * Side-scrolling strips that move as one: whichever is being swiped, the rest
 * follow it. Only that one is marked `data-driving`, for its snapping, as a
 * strip that snaps would jump to its nearest stop each time it is moved here.
 */
const useSyncedScroll = () => {
  const lanes = useRef(new Set<HTMLElement>())

  /** A ref callback for each strip */
  return (lane: HTMLElement | null) => {
    if (!lane) return
    const all = lanes.current

    const drive = () => {
      if (lane.dataset[DRIVING] !== undefined) return
      for (const other of all) delete other.dataset[DRIVING]
      lane.dataset[DRIVING] = ''
    }

    const follow = () => {
      if (lane.dataset[DRIVING] === undefined) return
      for (const other of all) {
        if (other !== lane) other.scrollLeft = lane.scrollLeft
      }
    }

    all.add(lane)
    lane.addEventListener('pointerdown', drive, { passive: true })
    lane.addEventListener('touchstart', drive, { passive: true })
    lane.addEventListener('wheel', drive, { passive: true })
    lane.addEventListener('focusin', drive)
    lane.addEventListener('scroll', follow, { passive: true })

    return () => {
      all.delete(lane)
      lane.removeEventListener('pointerdown', drive)
      lane.removeEventListener('touchstart', drive)
      lane.removeEventListener('wheel', drive)
      lane.removeEventListener('focusin', drive)
      lane.removeEventListener('scroll', follow)
    }
  }
}

export default useSyncedScroll
