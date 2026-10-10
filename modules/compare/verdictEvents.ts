/** What the model made of a comparison, as the page shows it */
export interface Verdict {
  summary: string
  /** Each car once at most, by slug */
  picks: Array<{ slug: string; when: string }>
}

/**
 * What the verdict's endpoint sends, one JSON object a line, while the model
 * works: its thinking as it goes, each car it looks up, and then the verdict
 * or the news that there will be none.
 */
export type VerdictEvent =
  | { type: 'reasoning'; text: string }
  | { type: 'lookup'; id: string; car: string; done: boolean }
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
