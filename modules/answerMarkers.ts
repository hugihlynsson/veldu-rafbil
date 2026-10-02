import type { TextStreamPart, ToolSet } from 'ai'

// The model is asked to end each answer with a [car:<ref>] marker for each car
// it recommends and a [q:<question>] marker for each follow-up. A question is
// 8-12 words and a ref under 60 characters: an opening with no `]` further
// than this after it is the model writing one in prose, and swallowing it
// would eat the answer.
const kinds = {
  followUps: { open: '[q:', longest: 300 },
  cars: { open: '[car:', longest: 100 },
}
const close = ']'

type Kind = keyof typeof kinds
const kindNames = Object.keys(kinds) as Kind[]
const longestOpen = Math.max(
  ...kindNames.map((kind) => kinds[kind].open.length),
)

/** What the markers held, in the order written. Car refs are not checked. */
export type AnswerMarkers = Record<Kind, string[]>

const nextOpening = (text: string, from: number) => {
  let next: { kind: Kind; start: number } | undefined
  for (const kind of kindNames) {
    const start = text.indexOf(kinds[kind].open, from)
    if (start !== -1 && (!next || start < next.start)) next = { kind, start }
  }
  return next
}

// A chunk can end partway into a marker's opening, and those characters
// cannot be shown until the next chunk says whether they were one
const heldOpening = (text: string): number => {
  for (
    let length = Math.min(longestOpen - 1, text.length);
    length > 0;
    length--
  ) {
    const tail = text.slice(-length)
    if (kindNames.some((kind) => kinds[kind].open.startsWith(tail))) {
      return length
    }
  }
  return 0
}

/**
 * Takes an answer as it streams and splits the markers out of it. `push`
 * returns what is safe to show so far; `end` returns the rest. Trailing
 * whitespace is held back as well, since the markers sit on lines of their own
 * and would otherwise leave blank lines at the bottom of every answer.
 */
export const createMarkerSplitter = () => {
  const found: AnswerMarkers = { followUps: [], cars: [] }
  let pending = ''

  // Only completed markers are cut here. What is held back — an unfinished
  // marker, a possible start of one, and the whitespace before either — is
  // decided once, after the loop.
  const drain = (): string => {
    let from = 0
    let unfinished: number | undefined

    for (;;) {
      const next = nextOpening(pending, from)
      if (!next) break
      const { open, longest } = kinds[next.kind]

      const end = pending.indexOf(close, next.start)
      if ((end === -1 ? pending.length : end) - next.start > longest) {
        from = next.start + open.length
        continue
      }
      if (end === -1) {
        unfinished = next.start
        break
      }

      const value = pending.slice(next.start + open.length, end).trim()
      if (value) found[next.kind].push(value)
      pending = pending.slice(0, next.start) + pending.slice(end + close.length)
      from = next.start
    }

    const held = unfinished ?? pending.length - heldOpening(pending)
    const shown = pending.slice(0, held).trimEnd().length
    const visible = pending.slice(0, shown)
    pending = pending.slice(shown)
    return visible
  }

  return {
    push: (text: string): string => {
      pending += text
      return drain()
    },
    // Whatever is left is trailing whitespace, a stray `[` or `[q`, or a
    // marker cut off before its `]`. Only the stray opening is the answer's.
    end: (): string => {
      const visible = drain()
      const rest = pending.trimStart()
      const cutOff = kindNames.some((kind) => rest.startsWith(kinds[kind].open))
      const tail = cutOff ? '' : pending.trimEnd()
      pending = ''
      return visible + tail
    },
    found: (): AnswerMarkers => ({
      followUps: [...found.followUps],
      cars: [...found.cars],
    }),
  }
}

/** The same split over a finished text, for answers stored before this ran */
export const splitMarkers = (
  text: string,
): AnswerMarkers & { text: string } => {
  const splitter = createMarkerSplitter()
  const visible = splitter.push(text) + splitter.end()
  return { text: visible, ...splitter.found() }
}

/**
 * For streamText's `experimental_transform`: takes the markers out of the text
 * before it reaches the client, and adds what they held to `found`. Each text
 * part has its own splitter, since a step can stream more than one.
 */
export const markerTransform =
  (found: AnswerMarkers) =>
  <TOOLS extends ToolSet>() => {
    const splitters = new Map<string, ReturnType<typeof createMarkerSplitter>>()

    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(part, controller) {
        if (part.type === 'text-start') {
          splitters.set(part.id, createMarkerSplitter())
          return controller.enqueue(part)
        }

        if (part.type !== 'text-delta' && part.type !== 'text-end') {
          return controller.enqueue(part)
        }
        const splitter = splitters.get(part.id)
        if (!splitter) return controller.enqueue(part)

        if (part.type === 'text-delta') {
          const text = splitter.push(part.text)
          if (text) controller.enqueue({ ...part, text })
          return
        }

        const text = splitter.end()
        if (text) controller.enqueue({ type: 'text-delta', id: part.id, text })
        const markers = splitter.found()
        found.followUps.push(...markers.followUps)
        found.cars.push(...markers.cars)
        splitters.delete(part.id)
        controller.enqueue(part)
      },
    })
  }
