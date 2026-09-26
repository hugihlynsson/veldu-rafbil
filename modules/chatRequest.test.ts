import { describe, expect, it } from 'vitest'

import type { ChatMessage } from './chatMessage'
import { MAX_MESSAGES, trimHistory } from './chatRequest'

const questionOf = (id: string): ChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', text: 'Er bZ4X fjórhjóladrifinn?' }],
})

const answerOf = (id: string, length: number): ChatMessage => ({
  id,
  role: 'assistant',
  parts: [{ type: 'text', text: 'a'.repeat(length) }],
})

const ids = (messages: ChatMessage[]) => messages.map((message) => message.id)

describe('trimHistory', () => {
  it('keeps a conversation that fits', () => {
    const messages = [questionOf('q1'), answerOf('a1', 500), questionOf('q2')]
    expect(trimHistory(messages)).toEqual(messages)
  })

  it('drops the oldest exchanges past the budget, keeping the newest', () => {
    const messages = [
      questionOf('q1'),
      answerOf('a1', 80_000),
      questionOf('q2'),
      answerOf('a2', 30_000),
      questionOf('q3'),
    ]
    expect(ids(trimHistory(messages))).toEqual(['q2', 'a2', 'q3'])
  })

  it('starts on a question rather than an orphaned answer', () => {
    const messages = [
      questionOf('q1'),
      answerOf('a1', 80_000),
      answerOf('a2', 30_000),
      questionOf('q2'),
    ]
    expect(ids(trimHistory(messages))).toEqual(['q2'])
  })

  it('always keeps the question being asked', () => {
    const messages = [answerOf('a1', 200_000), questionOf('q1')]
    expect(ids(trimHistory(messages))).toEqual(['q1'])
  })

  it('keeps no more messages than the route accepts', () => {
    const messages = Array.from({ length: 150 }, (_, i) =>
      i % 2 === 0 ? questionOf(`q${i}`) : answerOf(`a${i}`, 10),
    ).concat(questionOf('last'))

    const kept = trimHistory(messages)

    expect(kept.length).toBeLessThanOrEqual(MAX_MESSAGES)
    expect(kept[0].role).toBe('user')
    expect(kept.at(-1)?.id).toBe('last')
  })

  // An answer that called a tool for most of the list has more parts than the
  // route takes, and sent back it would refuse every question after it
  it('drops an answer the route would refuse, and what came before it', () => {
    const wide: ChatMessage = {
      id: 'wide',
      role: 'assistant',
      parts: Array.from({ length: 60 }, () => ({ type: 'step-start' })),
    }
    const messages = [
      questionOf('q1'),
      answerOf('a1', 10),
      questionOf('q2'),
      wide,
      questionOf('q3'),
      answerOf('a3', 10),
      questionOf('q4'),
    ]
    expect(ids(trimHistory(messages))).toEqual(['q3', 'a3', 'q4'])
  })
})
