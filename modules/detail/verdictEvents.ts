/** What the model made of the cars, as the page shows it */
export interface Verdict {
  paragraphs: string[]
}

/**
 * What the verdict's endpoint sends, one JSON object a line, while the model
 * works: that it has started, that it has finished thinking and begun to
 * write, and then the verdict or the news that there will be none. One
 * already written is sent alone, with no `working` before it, so the page
 * shows the model at work only when there is a wait. A reader skips a type it does
 * not know, so one can be added without breaking a page still open.
 */
export type VerdictEvent =
  | { type: 'working' }
  | { type: 'writing' }
  | { type: 'verdict'; verdict: Verdict }
  | { type: 'error' }

export const encodeEvent = (event: VerdictEvent): string =>
  `${JSON.stringify(event)}\n`

/**
 * The events in what has arrived so far, and what is left over: a chunk can
 * end partway through a line, which waits for the next one
 */
export const decodeEvents = (
  buffered: string,
): { events: VerdictEvent[]; rest: string } => {
  const lines = buffered.split('\n')
  const rest = lines.pop() ?? ''
  const events = lines.flatMap((line) => {
    if (!line.trim()) return []
    try {
      return [JSON.parse(line) as VerdictEvent]
    } catch {
      return []
    }
  })
  return { events, rest }
}
