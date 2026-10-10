import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = __dirname

// next/dynamic gives a component a Suspense boundary of its own only with
// `ssr: false` or a `loading` component. Without one, its first render
// suspends to the nearest boundary above, even with its chunk already in, and
// hides everything under that boundary for a moment. A chat engine hidden
// that way was remounted by Strict Mode, which stopped the question it was
// sending. So each one is client-only or rendered inside a <Suspense> of its
// own in the file that declares it.

/** The text from an opening bracket to the one that closes it */
const balanced = (source: string, open: number): string => {
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '(') depth++
    if (source[i] === ')' && --depth === 0) return source.slice(open, i + 1)
  }
  return source.slice(open)
}

/** The source inside each <Suspense>…</Suspense>, nested ones included */
const suspenseBlocks = (source: string): string[] =>
  [...source.matchAll(/<Suspense\b/g)].map(({ index }) => {
    let depth = 0
    for (const tag of source.slice(index).matchAll(/<\/?Suspense\b/g)) {
      depth += tag[0].startsWith('</') ? -1 : 1
      if (depth === 0) return source.slice(index, index + tag.index)
    }
    return source.slice(index)
  })

/** The components declared with dynamic() that have no boundary of their own */
const unguardedDynamics = (source: string): string[] =>
  [...source.matchAll(/const (\w+) = dynamic(?=\()/g)]
    .filter(({ index, 0: match }) => {
      const call = balanced(source, index + match.length)
      return !/\bssr:\s*false\b|\bloading:/.test(call)
    })
    .map(([, name]) => name)
    .filter(
      (name) =>
        !suspenseBlocks(source).some((block) =>
          new RegExp(`<${name}\\b`).test(block),
        ),
    )

const sourceFiles = (dir: string): string[] =>
  readdirSync(path.join(root, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /(?<!\.test)\.tsx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))

const files = ['app', 'components', 'utils'].flatMap(sourceFiles)
const withDynamic = files.filter((file) =>
  readFileSync(file, 'utf8').includes('dynamic('),
)

describe('a component loaded with next/dynamic', () => {
  it('is found in the source', () => {
    expect(withDynamic.length).toBeGreaterThan(0)
  })

  it.each(withDynamic.map((file) => [path.relative(root, file), file]))(
    'has a boundary of its own in %s',
    (_name, file) => {
      expect(unguardedDynamics(readFileSync(file, 'utf8'))).toEqual([])
    },
  )
})

describe('unguardedDynamics', () => {
  it('flags one rendered with no boundary of its own', () => {
    const source = `
      const Modal = dynamic(() => import('./Modal'))
      export default () => <div><Modal /></div>
    `
    expect(unguardedDynamics(source)).toEqual(['Modal'])
  })

  it('passes one rendered inside a Suspense', () => {
    const source = `
      const Modal = dynamic(importModal)
      export default () => (
        <Suspense fallback={null}>
          <Modal open />
        </Suspense>
      )
    `
    expect(unguardedDynamics(source)).toEqual([])
  })

  it('passes one that is client-only or has a loading component', () => {
    const source = `
      const A = dynamic(() => import('./A'), { ssr: false })
      const B = dynamic(() => import('./B'), { loading: () => null })
      export default () => <><A /><B /></>
    `
    expect(unguardedDynamics(source)).toEqual([])
  })

  it('does not take a Suspense around another component for its own', () => {
    const source = `
      const Modal = dynamic(importModal)
      export default () => (
        <>
          <Suspense fallback={null}><Other /></Suspense>
          <Modal />
        </>
      )
    `
    expect(unguardedDynamics(source)).toEqual(['Modal'])
  })
})
