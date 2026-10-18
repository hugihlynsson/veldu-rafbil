import { afterEach, describe, expect, it, vi } from 'vitest'

import { allowedURLs, fetchCarSpecs, specCorrections } from './evDatabase'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('the corrections to a car page', () => {
  // A car's page renamed would otherwise leave its correction reaching nothing
  it('are each for a page a car in the list points at', () => {
    const orphaned = Object.keys(specCorrections).filter(
      (url) => !allowedURLs.has(url),
    )
    expect(orphaned).toEqual([])
  })

  it('stand in for what the page says', async () => {
    const [url, correction] = Object.entries(specCorrections)[0]!
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        `<tr><td>Tow Hitch</td><td>No</td></tr>
         <tr><td>Towing Weight Braked</td><td>0 kg</td></tr>
         <tr><td>Seats</td><td>5</td></tr>`,
      ),
    )

    expect(await fetchCarSpecs(url)).toEqual({ seats: '5', ...correction })
  })
})
