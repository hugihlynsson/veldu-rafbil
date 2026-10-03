import { useLayoutEffect, useRef } from 'react'

import prefersReducedMotion from './prefersReducedMotion'

type Point = { x: number; y: number }

// By layout alone: a bounding rect would take in an entrance still playing,
// and every later move would start off by its transform
const layoutPosition = (node: HTMLElement): Point | null => {
  const parent = node.offsetParent
  if (!parent) return null
  const { left, top } = parent.getBoundingClientRect()
  return { x: left + node.offsetLeft, y: top + node.offsetTop }
}

// What is left of a move still playing, so the next starts where the box is
const playingOffset = (node: HTMLElement): Point => {
  const [x, y] = getComputedStyle(node).translate.split(' ')
  return { x: parseFloat(x) || 0, y: parseFloat(y) || 0 }
}

/**
 * Slides each tracked box from where it stood to where a render has put it
 * (first, last, invert, play), so a list that gains or loses one reflows
 * rather than jumps. Animates `translate`, which leaves `transform` to the
 * boxes' own entrances and exits.
 */
export default function useFlip() {
  const nodes = useRef(new Map<string, HTMLElement>())
  const positions = useRef(new Map<string, Point>())
  const moves = useRef(new Map<string, Animation>())

  useLayoutEffect(() => {
    const reduceMotion = prefersReducedMotion()
    const next = new Map<string, Point>()

    for (const [key, node] of nodes.current) {
      const position = layoutPosition(node)
      if (!position) continue
      next.set(key, position)

      const previous = positions.current.get(key)
      if (!previous || reduceMotion) continue
      const dx = previous.x - position.x
      const dy = previous.y - position.y
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue

      const playing = moves.current.get(key)
      const offset =
        playing?.playState === 'running' ? playingOffset(node) : { x: 0, y: 0 }
      playing?.cancel()
      moves.current.set(
        key,
        node.animate(
          [
            { translate: `${dx + offset.x}px ${dy + offset.y}px` },
            { translate: '0 0' },
          ],
          { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
        ),
      )
    }

    positions.current = next
  })

  return (key: string) => (node: HTMLElement | null) => {
    if (!node) return
    nodes.current.set(key, node)
    return () => {
      nodes.current.delete(key)
      moves.current.delete(key)
    }
  }
}
