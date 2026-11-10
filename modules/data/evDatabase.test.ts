import { describe, expect, it } from 'vitest'

import { allowedURLs, readCarSpecs, specCorrections } from './evDatabase'

describe('the corrections to a car page', () => {
  // A car's page renamed would otherwise leave its correction reaching nothing
  it('are each for a page a car in the list points at', () => {
    const orphaned = Object.keys(specCorrections).filter(
      (url) => !allowedURLs.has(url),
    )
    expect(orphaned).toEqual([])
  })

  it('stand in for what the page says', () => {
    const [url, correction] = Object.entries(specCorrections)[0]!
    const html = `<tr><td>Tow Hitch</td><td>No</td></tr>
       <tr><td>Towing Weight Braked</td><td>0 kg</td></tr>
       <tr><td>Seats</td><td>5</td></tr>`

    expect(readCarSpecs(url, html)).toEqual({ seats: '5', ...correction })
  })
})
