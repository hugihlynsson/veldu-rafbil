import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { carReviewPath } from './paths'

const root = path.join(__dirname, '../..')

// The sheet fetches this path and a route file serves it, and nothing else
// ties the two together
describe('carReviewPath', () => {
  it('names the route that serves a car its review', () => {
    const route = carReviewPath('[slug]')
    expect(existsSync(path.join(root, 'app', route, 'route.ts'))).toBe(true)
  })
})
