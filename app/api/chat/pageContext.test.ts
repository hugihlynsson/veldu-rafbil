import { describe, expect, it, vi } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { ChatMessage } from '@/modules/chat/message'
import { pageNote, withPageContext } from './pageContext'

// Its cache is Next's, which a test has no server for
vi.mock('@/app/api/verdict/[...slugs]/verdict', () => ({
  peekVerdict: async () => null,
}))

const [a] = cars
const verdict = { paragraphs: ['Ólíkir bílar.', 'Hvor á sitt.'] }

const question = (id: string, about?: string[]): ChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', text: `spurning ${id}` }],
  ...(about && { metadata: { about } }),
})

const textOf = (message: ChatMessage) =>
  message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('|')

describe('pageNote', () => {
  it('names the car whose page it was asked on, and its review', () => {
    const note = pageNote(a, verdict)
    expect(note).toContain(`síðu bílsins ${a.label}`)
    expect(note).toContain('"Ólíkir bílar. Hvor á sitt."')
  })

  it('says nothing of a review not written yet', () => {
    expect(pageNote(a, null)).not.toContain('umsögn')
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

  it('ignores slugs that name no car', async () => {
    const [message] = await withPageContext(
      [question('1', ['no-such-car'])],
      async () => verdict,
    )
    expect(textOf(message)).toBe('spurning 1')
  })
})
