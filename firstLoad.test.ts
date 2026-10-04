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

/** Every package the file pulls into the chunk it is part of */
const packagesImportedBy = (entry: string): Set<string> => {
  const packages = new Set<string>()
  const seen = new Set<string>()
  const queue = [entry]

  while (queue.length > 0) {
    const file = queue.pop()!
    if (seen.has(file)) continue
    seen.add(file)

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

  return packages
}

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

// The list is what every visitor downloads before the page responds; the chat
// and its modal are loaded behind next/dynamic, and everything they need can
// wait with them
describe("the list's first load", () => {
  const packages = packagesImportedBy(carList)

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
  const bar = readFileSync(carList, 'utf8').match(
    /dynamic\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]/,
  )?.[1]
  const entry = bar && resolveLocal(bar, carList)
  const packages = entry ? packagesImportedBy(entry) : new Set<string>()

  it('is what the list loads behind next/dynamic', () => {
    expect(entry).toMatch(/components\/chat\/\w+\.tsx$/)
    expect(packages).toContain('next/dynamic')
  })

  it.each(heavyPackages)('leaves out %s', (name) => {
    expect(importsOf(packages, name)).toEqual([])
  })
})
