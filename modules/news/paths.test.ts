import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { carHistoryPath, newsDayPath, newsYearPath } from './paths'

const root = path.join(__dirname, '../..')

// The sheet fetches this path and a route file serves it, and nothing else
// ties the two together
describe('carHistoryPath', () => {
  it('names the route that serves a car its updates', () => {
    const route = carHistoryPath('[slug]')
    expect(existsSync(path.join(root, 'app', route, 'route.ts'))).toBe(true)
  })
})

// Each is linked to from pages and the sitemap, and only a folder serves it
describe('newsDayPath and newsYearPath', () => {
  it('name the routes that serve a day and a year', () => {
    for (const route of [newsDayPath('[dagur]'), newsYearPath('[ar]')]) {
      expect(existsSync(path.join(root, 'app', route, 'page.tsx'))).toBe(true)
    }
  })
})
