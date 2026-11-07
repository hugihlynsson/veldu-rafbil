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
  /** When the last word scheduled so far appears */
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
