import { useState } from 'react'

const DRIVING = 'driving'

/**
 * Side-scrolling strips that move as one: whichever is being swiped, the rest
 * follow it. Only that one is marked `data-driving`, for its snapping, as a
 * strip that snaps would jump to its nearest stop each time it is moved here.
 */
const syncedScroll = () => {
  const all = new Set<HTMLElement>()

  return (lane: HTMLElement | null) => {
    if (!lane) return

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

/**
 * A ref callback for each strip. The same one for the life of the strips, as
 * a new one would take every strip's listeners off and put them back on each
 * render, and could drop the touch that marks the strip being swiped.
 */
const useSyncedScroll = () => useState(syncedScroll)[0]

export default useSyncedScroll
