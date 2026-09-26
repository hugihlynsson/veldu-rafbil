import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createFetchCarDetailsTool,
  MAX_CALLS_PER_ANSWER,
} from './fetchCarDetails'
import newCars from '@/modules/newCars'

type Tool = ReturnType<typeof createFetchCarDetailsTool>

// The allowlist is all that stands between a prompt and an arbitrary fetch
const run = async (
  url: string,
  tool: Tool = createFetchCarDetailsTool(),
): Promise<{ specifications: string }> => {
  // The options are only along for the ride; this tool reads none of them
  const result = await tool.execute!({ url, carName: 'Test' }, {
    toolCallId: 'test',
    messages: [],
  } as never)
  // execute is typed as possibly streaming; ours always resolves to an object
  return result as { specifications: string }
}

// The cache outlives each test, so every test asks for cars of its own
const allowedUrls = newCars
  .map((car) => car.evDatabaseUrl)
  .filter((url): url is string => Boolean(url))
let carsTaken = 0
const aCar = (): string => allowedUrls[carsTaken++]

const page = (html: string, status = 200) => new Response(html, { status })
const redirectTo = (location: string) =>
  new Response(null, { status: 301, headers: { location } })

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// 2 MB of 64 KB chunks is 32; the margin is for the stream reading ahead
const MAX_CHUNKS = 64

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

  // Against an uncapped read this hangs rather than fails
  it('stops reading a body that never ends', async () => {
    const encoder = new TextEncoder()
    const filler = encoder.encode('x'.repeat(64 * 1024))
    let chunksSent = 0

    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('<tr><td>Seats</td><td>5</td></tr>'))
      },
      pull(controller) {
        chunksSent += 1
        controller.enqueue(filler)
      },
    })

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(body, { status: 200 }),
    )

    const result = await run(aCar())

    expect(result.specifications).toContain('seats: 5')
    expect(chunksSent).toBeLessThan(MAX_CHUNKS)
  })

  it('does not read an error page for specifications', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      page('<tr><td>Seats</td><td>5</td></tr>', 503),
    )

    const result = await run(aCar())

    expect(result.specifications).not.toContain('seats: 5')
    expect(result.specifications).toContain('503')
  })

  it('reads the spec table, whatever case and spelling it is in', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      page(
        `<table>
          <tr><td>Length</td><td>4750 mm</td></tr>
          <tr><td>Cargo Volume</td><td>No Data</td></tr>
          <tr class="x"><td>CURB WEIGHT</td><td>2100 kg</td></tr>
          <tr><td>Seats</td><td>5</td></tr>
          <tr><td>Seats</td><td>7</td></tr>
        </table>`,
      ),
    )

    const result = await run(aCar())

    expect(result.specifications).toContain('length: 4750 mm')
    // Curb Weight is the older spelling of Weight Unladen
    expect(result.specifications).toContain('weightUnladen: 2100 kg')
    // "No Data" is the site saying it has none, not a specification
    expect(result.specifications).not.toContain('cargoVolume')
    // The first row answers, the way a search from the top of the page did
    expect(result.specifications).toContain('seats: 5')
    expect(result.specifications).not.toContain('seats: 7')
  })

  it('says so rather than inventing figures for a page with no table', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(page('<p>Ekkert hér</p>'))

    expect((await run(aCar())).specifications).toBe('No specifications found')
  })

  it('fetches no more cars than one answer is allowed', async () => {
    const urls = Array.from({ length: MAX_CALLS_PER_ANSWER + 1 }, aCar)
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => page('<tr><td>Seats</td><td>5</td></tr>'))

    const tool = createFetchCarDetailsTool()
    const results = []
    for (const url of urls) results.push(await run(url, tool))

    expect(fetchSpy).toHaveBeenCalledTimes(MAX_CALLS_PER_ANSWER)
    expect(results.at(-1)?.specifications).toMatch(/already been fetched/)
    // The next answer starts over
    expect((await run(urls.at(-1)!)).specifications).toContain('seats: 5')
  })

  it('fetches a URL that a car in the list actually points at', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(page('<tr><td>Seats</td><td>5</td></tr>'))

    const result = await run(aCar())

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(result.specifications).toContain('seats: 5')
  })
})

describe('fetchCarDetails, asked for a car again', () => {
  it('reads the page once for every answer that day', async () => {
    const url = aCar()
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => page('<tr><td>Seats</td><td>5</td></tr>'))

    const first = await run(url)
    const second = await run(url)

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(second).toEqual(first)
  })

  it('reads it afresh once a day has passed', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    const url = aCar()
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => page('<tr><td>Seats</td><td>5</td></tr>'))

    await run(url)
    vi.setSystemTime(Date.now() + 24 * 60 * 60 * 1000 + 1)
    await run(url)

    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  // A page that failed once is asked for again rather than held as a failure
  it('does not keep a failure', async () => {
    const url = aCar()
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(page('', 503))
      .mockResolvedValueOnce(page('<tr><td>Seats</td><td>5</td></tr>'))

    await run(url)

    expect((await run(url)).specifications).toContain('seats: 5')
  })
})

// The allowlist vouches for the URL the model named, not for wherever a
// redirect from it points
describe('fetchCarDetails, redirected', () => {
  it('follows a redirect that stays on ev-database', async () => {
    const url = aCar()
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(redirectTo('/car/1/Renamed'))
      .mockResolvedValueOnce(page('<tr><td>Seats</td><td>5</td></tr>'))

    const result = await run(url)

    expect(fetchSpy.mock.calls[1][0]).toBe(
      'https://ev-database.org/car/1/Renamed',
    )
    expect(result.specifications).toContain('seats: 5')
  })

  it.each([
    'http://169.254.169.254/latest/meta-data/',
    'https://ev-database.org.evil.example/car/1/',
    'http://ev-database.org/car/1/',
  ])('does not follow one to %s', async (location) => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(redirectTo(location))

    const result = await run(aCar())

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(result.specifications).toMatch(/does not follow/)
  })

  it('gives up on a redirect that goes round in circles', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => redirectTo('/car/1/Again'))

    const result = await run(aCar())

    expect(fetchSpy.mock.calls.length).toBeLessThan(10)
    expect(result.specifications).toMatch(/does not follow/)
  })
})
