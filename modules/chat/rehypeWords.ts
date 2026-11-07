import type { ElementContent, Root, RootContent } from 'hast'

export interface Word {
  /** Which text part of the message it is in */
  part: number
  /** Where it starts in that part's markdown, near enough: inline code counts
   * from its backtick and an escape as one character, the same way each time */
  offset: number
}

/**
 * Wraps each word of an answer in a span that says where it starts in the
 * markdown, so the browser can tell the words it has shown from the ones that
 * just arrived. React rebuilds the answer on every chunk and recreates the
 * words after any change of shape, so the elements themselves say nothing.
 */
const rehypeWords =
  ({ part }: { part: number }) =>
  (tree: Root) => {
    tree.children = split(tree.children, part)
  }

const split = <T extends RootContent>(
  children: T[],
  part: number,
): (T | ElementContent)[] =>
  children.flatMap((child): (T | ElementContent)[] => {
    if (child.type === 'element') {
      child.children = split(child.children, part)
      return [child]
    }
    const start = child.type === 'text' && child.position?.start.offset
    if (child.type !== 'text' || typeof start !== 'number') return [child]

    return Array.from(
      child.value.matchAll(/\s+|\S+/g),
      ({ 0: text, index }): ElementContent =>
        /^\s/.test(text)
          ? { type: 'text', value: text }
          : {
              type: 'element',
              tagName: 'span',
              properties: { dataWord: `${part}:${start + index}` },
              children: [{ type: 'text', value: text }],
            },
    )
  })

export const readWord = (name: string | undefined): Word | undefined => {
  const [part, offset] = name?.split(':').map(Number) ?? []
  return Number.isInteger(part) && Number.isInteger(offset)
    ? { part: part!, offset: offset! }
    : undefined
}

export default rehypeWords
