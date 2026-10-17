import { describe, expect, it } from 'vitest'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import type { ChatMessage } from '@/modules/chat/message'
import { pageNote, withPageContext } from './pageContext'

const [a] = cars
const review = { paragraphs: ['Góður bíll.', 'Fer langt.'], facts: '' }
const reviews = { [carSlug(a)]: review }

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
    const note = pageNote(a, review)
    expect(note).toContain(`síðu bílsins ${a.label}`)
    expect(note).toContain('"Góður bíll. Fer langt."')
  })

  it('says a car is no longer sold, as the advisor has no other word of it', () => {
    expect(pageNote({ ...a, deprecated: '2026-10-11' }, undefined)).toContain(
      'ekki lengur seldur nýr',
    )
  })

  it('says nothing of a review not written yet', () => {
    expect(pageNote(a, undefined)).not.toContain('umsögn')
  })
})

describe('withPageContext', () => {
  const slugs = [carSlug(a)]

  it('notes the page ahead of the question, leaving others alone', () => {
    const [plain, onPage] = withPageContext(
      [question('1'), question('2', slugs)],
      {},
    )
    expect(textOf(plain)).toBe('spurning 1')
    expect(textOf(onPage)).toMatch(/^\[Spurt á síðu bílsins.*\]\|spurning 2$/)
  })

  it('gives the review with the newest question only', () => {
    const [older, newest] = withPageContext(
      [question('1', slugs), question('2', slugs)],
      reviews,
    )
    expect(textOf(older)).not.toContain('Góður')
    expect(textOf(newest)).toContain('Góður')
  })

  it('ignores slugs that name no car', () => {
    const [message] = withPageContext([question('1', ['no-such-car'])], reviews)
    expect(textOf(message)).toBe('spurning 1')
  })
})
