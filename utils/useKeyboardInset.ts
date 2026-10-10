import { useEffect } from 'react'

/**
 * Publishes the keyboard's height as `--keyboard-inset`: it shrinks the visual
 * viewport only, and `position: fixed` answers to the layout one. And as
 * `--viewport-offset`, how far the browser has panned the layout viewport up
 * to reveal the focused field, for anything pinned to the top to follow.
 */
const useKeyboardInset = (): void => {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      // offsetTop is the part of the layout viewport scrolled out of sight
      const inset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )
      document.documentElement.style.setProperty(
        '--keyboard-inset',
        `${Math.round(inset)}px`,
      )
      document.documentElement.style.setProperty(
        '--viewport-offset',
        `${Math.round(Math.max(0, viewport.offsetTop))}px`,
      )
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      document.documentElement.style.removeProperty('--keyboard-inset')
      document.documentElement.style.removeProperty('--viewport-offset')
    }
  }, [])
}

export default useKeyboardInset
