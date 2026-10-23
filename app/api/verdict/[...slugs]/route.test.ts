import { afterEach, describe, expect, it, vi } from 'vitest'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { decodeEvents, type Verdict } from '@/modules/detail/verdictEvents'

const [a, b, c, d, e] = cars as readonly [Car, Car, Car, Car, Car, ...Car[]]
const verdict: Verdict = { paragraphs: ['Ólíkir bílar.'] }

// The cache is Next's and the writing a model's: both stand in here, so what
// is tested is who gets as far as buying a verdict
const loadGet = async ({
  written = null as Verdict | null,
  slugs = undefined as unknown,
} = {}) => {
  vi.resetModules()
  const writeVerdict = vi.fn(() => ({
    events: [{ type: 'verdict', verdict }],
    listeners: new Set(),
  }))
  vi.doMock('./verdict', () => ({
    peekVerdict: async () => written,
    writeVerdict,
  }))
  if (slugs) vi.doMock('@/modules/detail/slugs', () => slugs)
  const { GET } = await import('./route')
  const get = (path: ReadonlyArray<string>, address = '10.3.0.1') =>
    GET(
      new Request(`http://localhost/api/verdict/${path.join('/')}`, {
        headers: { 'x-forwarded-for': address },
      }),
      { params: Promise.resolve({ slugs: [...path] }) },
    )
  return { get, writeVerdict }
}

const pair = [a, b].map(carSlug)

afterEach(() => {
  vi.doUnmock('./verdict')
  vi.doUnmock('@/modules/detail/slugs')
})

describe('GET /api/verdict', () => {
  it('writes a verdict for two to four cars', async () => {
    const { get, writeVerdict } = await loadGet()
    for (const compared of [pair, [a, b, c, d].map(carSlug)]) {
      const response = await get(compared)
      expect(response.status).toBe(200)
      expect(await response.text()).toContain('Ólíkir bílar.')
    }
    expect(writeVerdict).toHaveBeenCalledTimes(2)
  })

  // A car's own review is written ahead, and more than four is no page
  it('buys nothing for one car or five', async () => {
    const { get, writeVerdict } = await loadGet()
    expect((await get([carSlug(a)])).status).toBe(404)
    expect((await get([a, b, c, d, e].map(carSlug))).status).toBe(404)
    expect(writeVerdict).not.toHaveBeenCalled()
  })

  // Only the page asks, for its cars as its address names them: any other
  // spelling would be another verdict to buy for the same cars
  it('buys nothing for an address the page would not ask by', async () => {
    const { get, writeVerdict } = await loadGet()
    for (const path of [
      [carSlug(a), 'no-such-car'],
      [carSlug(a).toUpperCase(), carSlug(b)],
      [carSlug(a), carSlug(a), carSlug(b)],
      [carSlug(a), '%25E0'],
    ]) {
      expect((await get(path)).status).toBe(404)
    }
    expect(writeVerdict).not.toHaveBeenCalled()
  })

  it('buys nothing for cars one of which is no longer sold', async () => {
    const sold = { ...b, deprecated: '2026-10-01' }
    const { get, writeVerdict } = await loadGet({
      slugs: {
        readSegment: (segment: string) => segment,
        resolveCompared: () => ({ cars: [a, sold], slugs: pair }),
      },
    })
    expect((await get(pair)).status).toBe(404)
    expect(writeVerdict).not.toHaveBeenCalled()
  })

  it('sends one already written, however often it is asked for', async () => {
    const { get, writeVerdict } = await loadGet({ written: verdict })
    for (let i = 0; i < 20; i++) {
      const response = await get(pair)
      expect(response.status).toBe(200)
    }
    expect(writeVerdict).not.toHaveBeenCalled()
  })

  // The page shows the model at work only once it hears one is
  it('says a model is working only when one is', async () => {
    const types = async (response: Response) =>
      decodeEvents(await response.text()).events.map((event) => event.type)

    const writing = await loadGet()
    expect(await types(await writing.get(pair))).toEqual(['working', 'verdict'])

    const written = await loadGet({ written: verdict })
    expect(await types(await written.get(pair))).toEqual(['verdict'])
  })

  it('refuses a caller past ten verdicts a minute', async () => {
    const { get } = await loadGet()
    const statuses = []
    for (let i = 0; i < 11; i++) statuses.push((await get(pair)).status)
    expect(statuses.slice(0, 10).every((status) => status === 200)).toBe(true)
    expect(statuses[10]).toBe(429)
    expect((await get(pair, '10.3.0.2')).status).toBe(200)
  })

  // A script that varies its address each time gets past the limit above
  it('buys no more than sixty an hour, whoever asks', async () => {
    const { get, writeVerdict } = await loadGet()
    const statuses = []
    for (let i = 0; i < 61; i++) {
      statuses.push(
        (await get(pair, `10.4.${Math.floor(i / 200)}.${i}`)).status,
      )
    }
    expect(statuses.slice(0, 60).every((status) => status === 200)).toBe(true)
    expect(statuses[60]).toBe(429)
    expect(writeVerdict).toHaveBeenCalledTimes(60)
  })
})
