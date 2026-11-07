import type { ElementContent, Root, RootContent } from 'hast'

/**
 * Wraps each word of an answer in a span named after where it starts in the
 * markdown, so the browser can tell the words it has shown from the ones that
 * just arrived. React rebuilds the answer on every chunk and recreates the
 * words after any change of shape, so the elements themselves say nothing.
 */
const rehypeWords =
  ({ part }: { part: number }) =>
  (tree: Root, file: { value: unknown }) => {
    tree.children = split(tree.children, part, String(file.value))
  }

const split = <T extends RootContent>(
  children: T[],
  part: number,
  source: string,
): (T | ElementContent)[] =>
  children.flatMap((child): (T | ElementContent)[] => {
    if (child.type === 'element') {
      child.children = split(child.children, part, source)
      return [child]
    }
    if (child.type !== 'text') return [child]
    const start = child.position?.start.offset
    const end = child.position?.end.offset
    if (start === undefined || end === undefined) return [child]

    // Looked up in the source rather than counted from the node's start, which
    // sits before the backtick of inline code and counts an escape as one
    let cursor = start
    return Array.from(
      child.value.matchAll(/\s+|\S+/g),
      ({ 0: text, index }): ElementContent => {
        if (/^\s/.test(text)) return { type: 'text', value: text }
        const found = source.indexOf(text, cursor)
        const offset = found >= 0 && found < end ? found : start + index
        cursor = offset + text.length
        return {
          type: 'element',
          tagName: 'span',
          properties: { dataWord: `${part}:${offset}` },
          children: [{ type: 'text', value: text }],
        }
      },
    )
  })

export default rehypeWords
