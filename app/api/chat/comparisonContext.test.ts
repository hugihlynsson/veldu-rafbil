import { describe, expect, it, vi } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { ChatMessage } from '@/modules/chat/message'
import { comparisonNote, withComparisonContext } from './comparisonContext'

// Its cache is Next's, which a test has no server for
vi.mock('@/app/api/comparison/[...slugs]/verdict', () => ({
  peekVerdict: async () => null,
}))

const [a, b] = cars
const verdict = { paragraphs: ['Ólíkir bílar.', 'Hvor á sitt.'] }

const question = (id: string, comparing?: string[]): ChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', text: `spurning ${id}` }],
  ...(comparing && { metadata: { comparing } }),
})

const textOf = (message: ChatMessage) =>
  message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('|')

describe('comparisonNote', () => {
  it('names the cars in full, and the summary when there is one', () => {
    const note = comparisonNote([a, b], verdict)
    expect(note).toContain(`${a.label} og ${b.label}`)
    expect(note).toContain('"Ólíkir bílar. Hvor á sitt."')
  })

  it('says nothing of a summary not written yet', () => {
    expect(comparisonNote([a, b], null)).not.toContain('samantekt')
  })
})

describe('withComparisonContext', () => {
  const slugs = [a, b].map(carSlug)

  it('notes the comparison ahead of the question, leaving others alone', async () => {
    const [plain, compared] = await withComparisonContext(
      [question('1'), question('2', slugs)],
      async () => null,
    )
    expect(textOf(plain)).toBe('spurning 1')
    expect(textOf(compared)).toMatch(
      /^\[Spurt á samanburðarsíðu.*\]\|spurning 2$/,
    )
  })

  it('reads the summary for the newest question only', async () => {
    const readVerdict = vi.fn(async () => verdict)
    const [older, newest] = await withComparisonContext(
      [question('1', slugs), question('2', slugs)],
      readVerdict,
    )
    expect(readVerdict).toHaveBeenCalledTimes(1)
    expect(textOf(older)).not.toContain('Ólíkir')
    expect(textOf(newest)).toContain('Ólíkir')
  })

  it('ignores slugs that name no car', async () => {
    const [message] = await withComparisonContext(
      [question('1', ['no-such-car'])],
      async () => verdict,
    )
    expect(textOf(message)).toBe('spurning 1')
  })
})
