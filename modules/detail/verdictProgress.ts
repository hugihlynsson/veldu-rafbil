// The model's thinking sends nothing until it is done, so the bar runs on
// time while it thinks: quick at first, then ever slower, so a long wait
// never reaches the end before the verdict does. The words come a second or
// two after the server says they have begun, which takes it most of the rest.

/** About how long the thinking takes at medium, as last measured */
export const THINKING_MS = 15_000

// Where the bar tends to while the model thinks, and while it writes
const THINKING_CEILING = 0.9
const WRITING_CEILING = 0.98
// Three quarters of the way across at the usual time
const THINKING_PACE = THINKING_MS / 1.8
const WRITING_PACE = 700

const towards = (from: number, to: number, elapsed: number, pace: number) =>
  from + (to - from) * (1 - Math.exp(-Math.max(0, elapsed) / pace))

/**
 * How far across the bar is, from 0 to 1, this long after the page asked
 * for the verdict, and with when the writing began if it has
 */
export const verdictProgress = (
  elapsed: number,
  writingAt?: number,
): number => {
  if (writingAt === undefined) {
    return towards(0, THINKING_CEILING, elapsed, THINKING_PACE)
  }
  const thought = towards(0, THINKING_CEILING, writingAt, THINKING_PACE)
  return towards(thought, WRITING_CEILING, elapsed - writingAt, WRITING_PACE)
}
