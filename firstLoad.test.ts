import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = __dirname

// Static imports only: a dynamic import() is a chunk of its own, loaded later,
// and a type-only import is erased before it reaches the bundle
const staticImport =
  /^\s*(?:import|export)\s+(?!type\b)(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm

const resolveLocal = (specifier: string, from: string): string | undefined => {
  const base = specifier.startsWith('@/')
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(from), specifier)

  return [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')].find(
    (candidate) => existsSync(candidate) && candidate.match(/\.tsx?$/),
  )
}

/** Every file and package the entry pulls into the chunk it is part of */
const importedBy = (entry: string) => {
  const packages = new Set<string>()
  const files = new Set<string>()
  const queue = [entry]

  while (queue.length > 0) {
    const file = queue.pop()!
    if (files.has(file)) continue
    files.add(file)

    for (const [, specifier] of readFileSync(file, 'utf8').matchAll(
      staticImport,
    )) {
      if (specifier.startsWith('.') || specifier.startsWith('@/')) {
        const resolved = resolveLocal(specifier, file)
        if (resolved) queue.push(resolved)
      } else {
        packages.add(specifier)
      }
    }
  }

  return { files, packages }
}

/** The files the entry imports with import(), each a chunk loaded later */
const loadedLaterBy = (entry: string): string[] =>
  [
    ...readFileSync(entry, 'utf8').matchAll(
      /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
    ),
  ].flatMap(([, specifier]) => resolveLocal(specifier, entry) ?? [])

const heavyPackages = [
  'zod',
  'ai',
  '@ai-sdk/react',
  'react-markdown',
  'remark-gfm',
]

const importsOf = (packages: Set<string>, name: string): string[] =>
  [...packages].filter(
    (imported) => imported === name || imported.startsWith(`${name}/`),
  )

const carList = path.join(root, 'components/list/CarList.tsx')
const lazyFromList = loadedLaterBy(carList)

// The list is what every visitor downloads before the page responds; the chat
// and its modal are loaded behind next/dynamic, and everything they need can
// wait with them
describe("the list's first load", () => {
  const { packages } = importedBy(carList)

  it('reads its imports', () => {
    expect(packages).toContain('nuqs')
  })

  it.each(heavyPackages)('leaves out %s', (name) => {
    expect(importsOf(packages, name)).toEqual([])
  })
})

// The bar arrives just after the list on every visit, though most visitors
// never chat; what answers them is loaded once they start to
describe('the chat bar', () => {
  const entry = lazyFromList.find((file) =>
    /components\/chat\/\w+\.tsx$/.test(file),
  )
  const { packages } = entry
    ? importedBy(entry)
    : { packages: new Set<string>() }

  it('is what the list loads behind next/dynamic', () => {
    expect(entry).toBeDefined()
    expect(packages).toContain('next/dynamic')
  })

  it.each(heavyPackages)('leaves out %s', (name) => {
    expect(importsOf(packages, name)).toEqual([])
  })
})

// Few visitors ever search, so the modal is fetched once the list has
// hydrated rather than with it. Nothing else on the list opens a modal, so the shared one goes too.
describe('the filter modal', () => {
  const { files } = importedBy(carList)

  it('is a chunk the list loads later', () => {
    expect(lazyFromList).toContain(
      path.join(root, 'components/filters/FilterModal.tsx'),
    )
  })

  it.each([
    'components/filters/FilterModal.tsx',
    'components/filters/FilterField.tsx',
    'components/Modal.tsx',
    'components/CloseButton.tsx',
  ])('leaves %s out of the first load', (file) => {
    expect(files).not.toContain(path.join(root, file))
  })
})
