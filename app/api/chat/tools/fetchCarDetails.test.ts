import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchCarDetailsTool } from './fetchCarDetails'
import newCars from '../../../../modules/newCars'

// The model chooses this argument, so the allowlist is the only thing standing
// between a prompt and an arbitrary fetch from our server.
const run = async (url: string): Promise<{ specifications: string }> => {
  // The options are only along for the ride; this tool reads none of them
  const result = await fetchCarDetailsTool.execute!({ url, carName: 'Test' }, {
    toolCallId: 'test',
    messages: [],
  } as never)
  // execute is typed as possibly streaming; ours always resolves to an object
  return result as { specifications: string }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchCarDetails', () => {
  it.each([
    'http://169.254.169.254/latest/meta-data/',
    'http://localhost:3000/api/chat',
    'file:///etc/passwd',
    'https://ev-database.org.evil.example/car/1/',
    'https://ev-database.org/car/9999/Not-In-Our-List',
  ])('refuses %s without fetching it', async (url) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    const result = await run(url)

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(result.specifications).toMatch(/not one of the ev-database entries/)
  })

  it('fetches a URL that a car in the list actually points at', async () => {
    const allowed = newCars.find((car) => car.evDatabaseURL)?.evDatabaseURL
    expect(allowed).toBeDefined()

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response('<tr><td>Seats</td><td>5</td></tr>', { status: 200 }),
      )

    const result = await run(allowed!)

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(result.specifications).toContain('seats: 5')
  })
})
