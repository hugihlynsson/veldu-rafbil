import { useEffect } from 'react'

/**
 * Publishes the keyboard's height as `--keyboard-inset`: it shrinks the visual
 * viewport only, and `position: fixed` answers to the layout one.
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
