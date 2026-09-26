import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(__dirname, '..')

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

// The list is what every visitor downloads before the page responds; the chat
// and its modal are loaded behind next/dynamic, and everything they need can
// wait with them
describe("the list's first load", () => {
  const packages = packagesImportedBy(path.join(root, 'components/CarList.tsx'))

  it('reads its imports', () => {
    expect(packages).toContain('nuqs')
  })

  it.each(['zod', 'ai', '@ai-sdk/react', 'react-markdown', 'remark-gfm'])(
    'leaves out %s',
    (name) => {
      expect(
        [...packages].filter(
          (imported) => imported === name || imported.startsWith(`${name}/`),
        ),
      ).toEqual([])
    },
  )
})
