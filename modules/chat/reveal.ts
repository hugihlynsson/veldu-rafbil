import type { Word } from './rehypeWords'

// The model sends an answer in bursts of about ten words every 150–400ms, so
// each burst's words are spread over the time until the next one is due
// rather than shown at once. Times are in the caller's clock, ms.

export const WORD_FADE_MS = 250

// The gap the first burst is spread over, before there is one to measure
const FIRST_GAP_MS = 200
// A pause for a tool call is not the pace the model writes at
const MAX_GAP_MS = 500
const GAP_SMOOTHING = 0.3
// Fast enough to catch up when bursts arrive faster than they are shown
const MIN_STEP_MS = 4
// Slow enough that a lone word after a long pause does not drip in
const MAX_STEP_MS = 60

export interface Reveal {
  /** The first moment free for the next word, a step after the last one */
  cursor: number
  /** When the last burst arrived */
  lastArrival: number | undefined
  /** The time between bursts, smoothed */
  gap: number
}

export const startReveal = (): Reveal => ({
  cursor: -Infinity,
  lastArrival: undefined,
  gap: FIRST_GAP_MS,
})

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * When each of `count` words that arrived at `now` should appear: in order,
 * after the words before them, and done by about when the next burst lands.
 */
export const scheduleWords = (
  reveal: Reveal,
  count: number,
  now: number,
): { times: number[]; reveal: Reveal } => {
  if (count === 0) return { times: [], reveal }

  const gap =
    reveal.lastArrival === undefined
      ? reveal.gap
      : reveal.gap +
        (Math.min(now - reveal.lastArrival, MAX_GAP_MS) - reveal.gap) *
          GAP_SMOOTHING
  const from = Math.max(now, reveal.cursor)
  const step = clamp((now + gap - from) / count, MIN_STEP_MS, MAX_STEP_MS)

  return {
    times: Array.from({ length: count }, (_, index) => from + index * step),
    reveal: { cursor: from + count * step, lastArrival: now, gap },
  }
}

/**
 * The words of one answer shown so far. An answer only grows at its end, so a
 * word that starts before the end of the text last on screen has been shown,
 * whatever markdown has made of it since: a closing `**` moves the start of
 * the word it opened, and that word must not count as arriving again.
 */
export interface Shown {
  /** Per part, where the text last on screen ends */
  reach: Map<number, number>
  /** Per part, the offsets of the words that arrived and when each appears,
   * in order */
  times: Map<number, [offset: number, at: number][]>
}

export const startShown = (): Shown => ({ reach: new Map(), times: new Map() })

/** When a word that has been shown appears, or undefined for one just arrived.
 * Taken from the nearest word that arrived at or before it, as its start may
 * have moved since. */
export const shownAt = (shown: Shown, word: Word): number | undefined => {
  if (word.offset >= (shown.reach.get(word.part) ?? 0)) return undefined
  const times = shown.times.get(word.part) ?? []
  let low = 0
  let high = times.length
  while (low < high) {
    const mid = (low + high) >> 1
    if (times[mid]![0] <= word.offset) low = mid + 1
    else high = mid
  }
  return low > 0 ? times[low - 1]![1] : -Infinity
}

/** Records the words on screen once each has been looked up: when the ones
 * that just arrived appear, and how far the text now reaches, as the last
 * word grows with the chunks after the one it arrived in */
export const markShown = (
  shown: Shown,
  words: ReadonlyArray<{ word: Word; length: number; arrivesAt?: number }>,
) => {
  for (const { word, length, arrivesAt } of words) {
    if (arrivesAt !== undefined) {
      const times = shown.times.get(word.part) ?? []
      times.push([word.offset, arrivesAt])
      shown.times.set(word.part, times)
    }
    shown.reach.set(
      word.part,
      Math.max(shown.reach.get(word.part) ?? 0, word.offset + length),
    )
  }
}
