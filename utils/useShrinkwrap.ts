import { measureLineStats, prepareWithSegments } from '@chenglou/pretext'
import { useLayoutEffect, useRef } from 'react'

// Holds a bubble of pre-line text to the narrowest width that wraps it into
// no more lines than its max-width does, so the lines come out even rather
// than one long one over a short last one. CSS can neither balance a box's
// lines nor size it to the lines it ends up with.
const useShrinkwrap = <T extends HTMLElement>(text: string) => {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || !parent) return

    let observer: ResizeObserver | undefined
    let cancelled = false

    const fit = () => {
      const style = getComputedStyle(element)
      const parentStyle = getComputedStyle(parent)
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      // A paragraph at a time, as pre-wrap would count the space a line
      // breaks at, which pre-line hangs out of the box
      const paragraphs = text
        .split('\n')
        .map((paragraph) => prepareWithSegments(paragraph, font))
      const padding =
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth)

      const resize = () => {
        const parentWidth =
          parent.clientWidth -
          parseFloat(parentStyle.paddingLeft) -
          parseFloat(parentStyle.paddingRight)
        // Nothing to fit to until the dialog it sits in is shown
        if (parentWidth <= 0) return
        const maxWidth = style.maxWidth.endsWith('%')
          ? (parentWidth * parseFloat(style.maxWidth)) / 100
          : Math.min(parentWidth, parseFloat(style.maxWidth) || Infinity)
        const stats = (width: number) =>
          paragraphs.map((paragraph) => measureLineStats(paragraph, width))
        const lineCount = (width: number) =>
          stats(width).reduce((sum, { lineCount }) => sum + lineCount, 0)

        // Each paragraph's count only falls as the width grows, so the total
        // does too, and the narrowest width that keeps it can be searched for
        const lines = lineCount(maxWidth - padding)
        let low = 1
        let high = Math.max(1, Math.ceil(maxWidth - padding))
        while (low < high) {
          const mid = Math.floor((low + high) / 2)
          if (lineCount(mid) <= lines) high = mid
          else low = mid + 1
        }
        const widest = Math.max(
          ...stats(low).map(({ maxLineWidth }) => maxLineWidth),
        )
        // Rounded up, as a fraction short would wrap the widest line again
        element.style.width = `${Math.min(maxWidth, Math.ceil(widest) + padding)}px`
      }

      resize()
      observer = new ResizeObserver(resize)
      observer.observe(parent)
    }

    // Measured against the fallback face, every line would come out wrong
    if (document.fonts.status === 'loaded') fit()
    else
      void document.fonts.ready.then(() => {
        if (!cancelled) fit()
      })

    return () => {
      cancelled = true
      observer?.disconnect()
      element.style.width = ''
    }
  }, [text])

  return ref
}

export default useShrinkwrap
