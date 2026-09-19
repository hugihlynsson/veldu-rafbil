import { useEffect } from 'react'

/**
 * Publishes how much of the bottom of the page the on-screen keyboard is
 * covering, as `--keyboard-inset`, for anything pinned down there to sit on
 * top of rather than behind.
 *
 * A phone keyboard shrinks the visual viewport and leaves the layout viewport
 * alone, and `position: fixed` answers to the layout one — so a bar at the
 * bottom of the screen stays at the bottom of the screen, under the keyboard,
 * where it cannot be seen or reached. visualViewport is what reports the
 * difference; there is no CSS that asks the question on its own.
 */
const useKeyboardInset = (): void => {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      // offsetTop counts the part of the layout viewport scrolled out of sight
      // above, which the browser does on its own to reveal the focused field
      const inset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )
      document.documentElement.style.setProperty(
        '--keyboard-inset',
        `${Math.round(inset)}px`,
      )
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      document.documentElement.style.removeProperty('--keyboard-inset')
    }
  }, [])
}

export default useKeyboardInset
