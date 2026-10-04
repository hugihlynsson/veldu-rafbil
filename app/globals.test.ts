import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.join(__dirname, '..')

const components = readdirSync(path.join(root, 'components'), {
  recursive: true,
  encoding: 'utf8',
})
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => ({
    file,
    source: readFileSync(path.join(root, 'components', file), 'utf8'),
  }))

const offenders = (pattern: RegExp) =>
  components
    .filter(({ source }) => pattern.test(source))
    .map(({ file }) => file)

// Each colour is a role with a value in both themes, so a component that
// names a theme or a colour of its own is one the other theme was never
// picked against
describe('the components', () => {
  it('are read', () => {
    expect(components.length).toBeGreaterThan(20)
  })

  it('ask for no theme', () => {
    expect(offenders(/(?<![\w-])dark:/)).toEqual([])
  })

  it('name no colour of their own', () => {
    expect(offenders(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/i)).toEqual([])
  })

  // It animates whatever else changes too: a focus ring, a width
  it('transition only what they mean to', () => {
    expect(offenders(/\btransition-all\b/)).toEqual([])
  })
})

describe('the theme', () => {
  const css = readFileSync(path.join(__dirname, 'globals.css'), 'utf8')

  // So a default like bg-gray-100 or shadow-md generates nothing, rather than
  // a value the dark block, the corner scaling or the breakpoints never reach
  it.each(['color', 'radius', 'shadow', 'breakpoint'])(
    "clears Tailwind's --%s-* defaults",
    (namespace) => {
      expect(css).toContain(`--${namespace}-*: initial;`)
    },
  )
})
