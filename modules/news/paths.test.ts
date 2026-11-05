import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { carHistoryPath } from './paths'

const root = path.join(__dirname, '../..')

// The sheet fetches this path and a route file serves it, and nothing else
// ties the two together
describe('carHistoryPath', () => {
  it('names the route that serves a car its updates', () => {
    const route = carHistoryPath('[slug]')
    expect(existsSync(path.join(root, 'app', route, 'route.ts'))).toBe(true)
  })
})
