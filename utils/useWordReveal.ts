import { useLayoutEffect, useRef } from 'react'
import { scheduleWords, startReveal, WORD_FADE_MS } from '@/modules/chat/reveal'
import prefersReducedMotion from '@/utils/prefersReducedMotion'

const fade = (word: HTMLElement, delay: number) => {
  for (const animation of word.getAnimations()) animation.cancel()
  word.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: WORD_FADE_MS,
    delay,
    easing: 'ease-out',
    fill: 'backwards',
  })
}

/**
 * Fades in the words of a streaming answer, spread over the bursts they
 * arrive in. Works on the `data-word` spans rehypeWords makes, by name: React
 * recreates a word whenever the markdown around it changes shape, and a word
 * already shown must not fade in again. In the Web Animations API rather than
 * CSS, as a word put back mid-fade picks up where it was.
 */
const useWordReveal = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T>(null)
  const reveal = useRef(startReveal())
  const appearsAt = useRef(new Map<string, number>())

  // After every commit, before the browser paints the words it added
  useLayoutEffect(() => {
    const root = ref.current
    if (!enabled || !root || prefersReducedMotion()) return

    const now = performance.now()
    const arrived: HTMLElement[] = []
    for (const word of root.querySelectorAll<HTMLElement>('[data-word]')) {
      const at = appearsAt.current.get(word.dataset.word!)
      if (at === undefined) arrived.push(word)
      else if (at + WORD_FADE_MS > now && word.getAnimations().length === 0)
        fade(word, at - now)
    }

    const scheduled = scheduleWords(reveal.current, arrived.length, now)
    reveal.current = scheduled.reveal
    arrived.forEach((word, index) => {
      const at = scheduled.times[index] ?? now
      appearsAt.current.set(word.dataset.word!, at)
      fade(word, at - now)
    })
  })

  return ref
}

export default useWordReveal
