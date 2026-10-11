import { describe, expect, it, vi } from 'vitest'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import carReviews from '@/modules/data/carReviews'
import type { ChatMessage } from '@/modules/chat/message'
import { pageNote, withPageContext } from './pageContext'

// Its cache is Next's, which a test has no server for
vi.mock('@/app/api/verdict/[...slugs]/verdict', () => ({
  peekVerdict: async () => null,
}))

const [a, b] = cars as readonly [Car, Car, ...Car[]]
const verdict = { paragraphs: ['Ólíkir bílar.', 'Hvor á sitt.'] }

const question = (id: string, about?: string[]): ChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', text: `spurning ${id}` }],
  ...(about && { metadata: { about } }),
})

const textOf = (message: ChatMessage | undefined) =>
  (message?.parts ?? [])
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('|')

describe('pageNote', () => {
  it('names the car whose page it was asked on, and its review', () => {
    const note = pageNote([a], verdict)
    expect(note).toContain(`síðu bílsins ${a.label}`)
    expect(note).toContain('"Ólíkir bílar. Hvor á sitt."')
  })

  it('says a car is no longer sold, as the advisor has no other word of it', () => {
    expect(pageNote([{ ...a, deprecated: '2026-10-11' }], null)).toContain(
      'ekki lengur seldur nýr',
    )
  })

  it('keeps back the review of a car no longer sold, as its page does', () => {
    expect(
      pageNote([{ ...a, deprecated: '2026-10-11' }], verdict),
    ).not.toContain('umsögn')
  })

  it('says nothing of a review not written yet', () => {
    expect(pageNote([a], null)).not.toContain('umsögn')
  })
})

describe('pageNote on a comparison', () => {
  it('names the cars compared, and the summary', () => {
    const note = pageNote([a, b], verdict)
    expect(note).toContain(`samanburðarsíðu`)
    expect(note).toContain(`${a.label} og ${b.label}`)
    expect(note).toContain('"Ólíkir bílar. Hvor á sitt."')
  })

  it('names a car compared that is no longer sold', () => {
    expect(pageNote([a, { ...b, deprecated: '2026-10-11' }], null)).toContain(
      `${b.label} er ekki lengur seldur nýr`,
    )
  })
})

describe('withPageContext', () => {
  const slugs = [carSlug(a)]

  it('notes the page ahead of the question, leaving others alone', async () => {
    const [plain, compared] = await withPageContext(
      [question('1'), question('2', slugs)],
      async () => null,
    )
    expect(textOf(plain)).toBe('spurning 1')
    expect(textOf(compared)).toMatch(/^\[Spurt á síðu bílsins.*\]\|spurning 2$/)
  })

  it('reads the review for the newest question only', async () => {
    const readVerdict = vi.fn(async () => verdict)
    const [older, newest] = await withPageContext(
      [question('1', slugs), question('2', slugs)],
      readVerdict,
    )
    expect(readVerdict).toHaveBeenCalledTimes(1)
    expect(textOf(older)).not.toContain('Ólíkir')
    expect(textOf(newest)).toContain('Ólíkir')
  })

  it('notes a comparison as one', async () => {
    const [message] = await withPageContext(
      [question('1', [a, b].map(carSlug))],
      async () => null,
    )
    expect(textOf(message)).toMatch(
      /^\[Spurt á samanburðarsíðu.*\]\|spurning 1$/,
    )
  })

  it("gives a car's review from the data", async () => {
    const [message] = await withPageContext([question('1', slugs)])
    expect(textOf(message)).toContain(
      carReviews[carSlug(a)]!.paragraphs[0]!.slice(0, 40),
    )
  })

  it('ignores slugs that name no car', async () => {
    const [message] = await withPageContext(
      [question('1', ['no-such-car'])],
      async () => verdict,
    )
    expect(textOf(message)).toBe('spurning 1')
  })
})
