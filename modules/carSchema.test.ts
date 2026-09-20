import { describe, expect, it } from 'vitest'

import { buildDatasetSchema, serialiseSchema } from './carSchema'
import newCars from './newCars'

describe('the dataset markup', () => {
  it('points at the published JSON', () => {
    const [download] = buildDatasetSchema().distribution
    expect(download!.contentUrl).toBe('/api/cars')
    expect(download!.encodingFormat).toBe('application/json')
  })

  it('counts the cars from the list', () => {
    expect(buildDatasetSchema().description).toContain(String(newCars.length))
  })
})

describe('serialising it into the page', () => {
  // An unescaped `<` could close the script block early
  it('escapes anything that could end the script block', () => {
    const escaped = serialiseSchema({ name: '</script><img onerror=x>' })
    expect(escaped).not.toContain('<')
    expect(JSON.parse(escaped).name).toBe('</script><img onerror=x>')
  })

  it('stays valid JSON', () => {
    expect(() =>
      JSON.parse(serialiseSchema(buildDatasetSchema())),
    ).not.toThrow()
  })
})
