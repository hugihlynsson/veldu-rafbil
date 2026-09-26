import type { TextStreamPart, ToolSet } from 'ai'

// The model is asked to end each answer with [q:<question>] markers
const open = '[q:'
const close = ']'
// A question is 8-12 words. An opening with no `]` this far after it is the
// model writing `[q:` in prose, and swallowing it would eat the answer.
const longestMarker = 300

// A chunk can end partway into a marker's opening, and those characters
// cannot be shown until the next chunk says whether they were one
const heldOpening = (text: string): number => {
  for (
    let length = Math.min(open.length - 1, text.length);
    length > 0;
    length--
  ) {
    if (open.startsWith(text.slice(-length))) return length
  }
  return 0
}

/**
 * Takes an answer as it streams and splits the follow-up markers out of it.
 * `push` returns what is safe to show so far; `end` returns the rest. Trailing
 * whitespace is held back as well, since the markers sit on lines of their own
 * and would otherwise leave blank lines at the bottom of every answer.
 */
export const createFollowUpSplitter = () => {
  const questions: string[] = []
  let pending = ''

  const drain = (): string => {
    let visible = ''

    for (;;) {
      const start = pending.indexOf(open)
      if (start === -1) break

      const end = pending.indexOf(close, start + open.length)
      if (end === -1) {
        if (pending.length - start > longestMarker) {
          visible += pending.slice(0, start + open.length)
          pending = pending.slice(start + open.length)
          continue
        }
        // Unfinished: the rest of it is still on its way
        const before = pending.slice(0, start).trimEnd()
        visible += before
        pending = pending.slice(before.length)
        return visible
      }
      if (end - start > longestMarker) {
        visible += pending.slice(0, start + open.length)
        pending = pending.slice(start + open.length)
        continue
      }

      // The whitespace before a marker stays pending: it is only part of the
      // answer if more of the answer follows
      const before = pending.slice(0, start)
      const gap = before.length - before.trimEnd().length
      visible += before.slice(0, before.length - gap)
      const question = pending.slice(start + open.length, end).trim()
      if (question) questions.push(question)
      pending =
        before.slice(before.length - gap) + pending.slice(end + close.length)
    }

    const shown = pending
      .slice(0, pending.length - heldOpening(pending))
      .trimEnd().length
    visible += pending.slice(0, shown)
    pending = pending.slice(shown)

    return visible
  }

  return {
    push: (text: string): string => {
      pending += text
      return drain()
    },
    // Whatever is left is trailing whitespace, a stray `[` or `[q`, or a
    // marker cut off before its `]` — none of it is part of the answer
    end: (): string => {
      const visible = drain()
      const rest = pending.trimStart().startsWith(open) ? '' : pending.trimEnd()
      pending = ''
      return visible + rest
    },
    questions: (): string[] => [...questions],
  }
}

/** The same split over a finished text, for answers stored before this ran */
export const splitFollowUps = (
  text: string,
): { text: string; questions: string[] } => {
  const splitter = createFollowUpSplitter()
  const visible = splitter.push(text) + splitter.end()
  return { text: visible.trim(), questions: splitter.questions() }
}

/**
 * For streamText's `experimental_transform`: takes the markers out of the text
 * before it reaches the client, and adds what they asked to `questions`. Each
 * text part has its own splitter, since a step can stream more than one.
 */
export const followUpTransform =
  (questions: string[]) =>
  <TOOLS extends ToolSet>() => {
    const splitters = new Map<
      string,
      ReturnType<typeof createFollowUpSplitter>
    >()

    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(part, controller) {
        if (part.type === 'text-start') {
          splitters.set(part.id, createFollowUpSplitter())
        } else if (part.type === 'text-delta') {
          const splitter = splitters.get(part.id)
          if (splitter) {
            const text = splitter.push(part.text)
            if (text) controller.enqueue({ ...part, text })
            return
          }
        } else if (part.type === 'text-end') {
          const splitter = splitters.get(part.id)
          if (splitter) {
            const text = splitter.end()
            if (text)
              controller.enqueue({ type: 'text-delta', id: part.id, text })
            questions.push(...splitter.questions())
            splitters.delete(part.id)
          }
        }

        controller.enqueue(part)
      },
    })
  }
