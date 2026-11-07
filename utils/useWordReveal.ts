import { useLayoutEffect, useRef, useState } from 'react'
import { readWord, type Word } from '@/modules/chat/rehypeWords'
import {
  markShown,
  scheduleWords,
  shownAt,
  startReveal,
  startShown,
  WORD_FADE_MS,
  type Reveal,
  type Shown,
} from '@/modules/chat/reveal'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

const fade = (element: HTMLElement, delay: number) => {
  for (const animation of element.getAnimations()) animation.cancel()
  element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: WORD_FADE_MS,
    delay,
    easing: 'ease-out',
    fill: 'backwards',
  })
}

/**
 * Fades in the words of a streaming answer, spread over the bursts they
 * arrive in, on the `data-word` spans rehypeWords makes. In the Web Animations
 * API rather than CSS, as React recreates a word whenever the markdown around
 * it changes shape, and one put back mid-fade picks up where it was.
 * `enabled` says whether to make the spans at all.
 */
const useWordReveal = <T extends HTMLElement>(animate: boolean) => {
  const ref = useRef<T>(null)
  const state = useRef<{ reveal: Reveal; shown: Shown }>(null)
  // As it was when the answer arrived: the chat is only ever rendered in the
  // browser, once it has been opened
  const [enabled] = useState(() => animate && !prefersReducedMotion())

  // After every commit, before the browser paints the words it added
  useLayoutEffect(() => {
    const root = ref.current
    if (!enabled || !root) return
    const { reveal, shown } = (state.current ??= {
      reveal: startReveal(),
      shown: startShown(),
    })

    const now = performance.now()
    const words: { word: Word; length: number; arrivesAt?: number }[] = []
    const arrived: [HTMLElement, (typeof words)[number]][] = []
    for (const element of root.querySelectorAll<HTMLElement>('[data-word]')) {
      const word = readWord(element.dataset.word)
      if (!word) continue
      const seen = { word, length: element.textContent.length }
      words.push(seen)
      const at = shownAt(shown, word)
      if (at === undefined) arrived.push([element, seen])
      else if (at + WORD_FADE_MS > now && element.getAnimations().length === 0)
        fade(element, at - now)
    }

    const scheduled = scheduleWords(reveal, arrived.length, now)
    state.current.reveal = scheduled.reveal
    arrived.forEach(([element, seen], index) => {
      seen.arrivesAt = scheduled.times[index] ?? now
      fade(element, seen.arrivesAt - now)
    })
    markShown(shown, words)
  })

  return { ref, enabled }
}

export default useWordReveal
