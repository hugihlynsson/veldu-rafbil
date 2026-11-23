/**
 * Pulling down past the top of `scroller` grows the element in it marked
 * `data-overscroll-stretch` up from its bottom edge by exactly the bounce, so
 * the photo zooms to fill the gap, and holds the one marked
 * `data-overscroll-pin` where it was. Only Safari tells a page how far a box
 * has bounced, as a negative scrollTop; Chrome draws its bounce after layout
 * and reports nothing, so its gap shows the reflection instead.
 */
export const stretchOverscroll = (scroller: HTMLElement): (() => void) => {
  let applied = false

  const onScroll = () => {
    const over = Math.max(-scroller.scrollTop, 0)
    // Most scrolls are nowhere near the top: neither query nor measure there
    if (!over && !applied) return
    applied = over > 0
    const stretched = scroller.querySelector<HTMLElement>(
      '[data-overscroll-stretch]',
    )
    if (stretched) {
      const height = stretched.offsetHeight
      stretched.style.scale = over ? `${(height + over) / height}` : ''
    }
    const pinned = scroller.querySelector<HTMLElement>('[data-overscroll-pin]')
    if (pinned) pinned.style.translate = over ? `0 ${-over}px` : ''
  }

  scroller.addEventListener('scroll', onScroll, { passive: true })
  return () => scroller.removeEventListener('scroll', onScroll)
}
