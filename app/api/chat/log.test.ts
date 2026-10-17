import { describe, expect, it } from 'vitest'

import type { ChatFinish } from './chat'
import { carPage, chatLogEvent, questionSource, type ChatTurn } from './log'
import type { ChatMessage } from '@/modules/chat/message'
import { CHAT_SUGGESTIONS } from '@/modules/chat/suggestions'

const turn: ChatTurn = {
  timestamp: '2026-10-09T12:00:00.000Z',
  conversationId: '4f8a2c3e-9b1d-4e6f-8a7b-2c3d4e5f6a7b',
  userMessage: 'Hver er ódýrasti bíllinn?',
  source: 'typed',
  carPage: undefined,
  messageCount: 3,
  model: 'gemini-3.8-flash',
  environment: 'production',
  commit: 'd791754',
}

const timing = { firstTextMs: 1_200, durationMs: 5_400 }

const finish: ChatFinish = {
  text: 'Leapmotor T03.',
  followUps: ['Hvað fer hann langt?'],
  cars: ['car-leapmotor-t03'],
  usage: {
    inputTokens: 10,
    outputTokens: 20,
    totalTokens: 30,
  } as ChatFinish['usage'],
  toolCalls: [],
}

// Every turn is logged with its conversation, however it ended, so a review
// can read a conversation whole and see the answers that never arrived
describe('chatLogEvent', () => {
  it('logs a finished answer with the turn it answers', () => {
    expect(chatLogEvent(turn, { finish }, timing)).toEqual({
      type: 'chat_response_finished',
      ...turn,
      ...timing,
      assistantResponse: finish.text,
      followUps: finish.followUps,
      cars: finish.cars,
      tokenUsage: finish.usage,
      toolCalls: [],
    })
  })

  it('logs a failed answer with its error', () => {
    expect(
      chatLogEvent(turn, { error: new Error('Quota exceeded') }, timing),
    ).toEqual({
      type: 'chat_response_unfinished',
      reason: 'error',
      error: 'Quota exceeded',
      ...turn,
      ...timing,
    })
  })

  it('logs an answer the visitor left before it ended', () => {
    const left = { firstTextMs: undefined, durationMs: 800 }
    expect(chatLogEvent(turn, undefined, left)).toEqual({
      type: 'chat_response_unfinished',
      reason: 'disconnected',
      ...turn,
      ...left,
    })
  })

  it('cuts an error down to a size worth logging', () => {
    const event = chatLogEvent(turn, { error: 'x'.repeat(50_000) }, timing)
    expect('error' in event && event.error.length).toBe(1_000)
  })
})

describe('questionSource', () => {
  const ask = (text: string, id = 'q'): ChatMessage => ({
    id,
    role: 'user',
    parts: [{ type: 'text', text }],
  })
  const answer: ChatMessage = {
    id: 'a',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Leapmotor T03.' }],
    metadata: { followUps: ['Hvað fer hann langt?'] },
  }

  it('reads a question the answer before it offered as a follow-up', () => {
    expect(
      questionSource([ask('x'), answer, ask('Hvað fer hann langt?')]),
    ).toBe('followUp')
  })

  it('reads a starter pill', () => {
    expect(questionSource([ask(CHAT_SUGGESTIONS[0]!)])).toBe('starter')
  })

  describe('on a car page', () => {
    const slug = 'kia-ev3-long-range'
    const askOnPage = (text: string, about = slug): ChatMessage => ({
      ...ask(text),
      metadata: { about: [about] },
    })
    const reviews = {
      [slug]: { paragraphs: [], facts: '', questions: ['Dugar hann?'] },
    }

    it("reads the car's own starter", () => {
      expect(questionSource([askOnPage('Dugar hann?')], reviews)).toBe(
        'starter',
      )
    })

    // Not offered there, so typed to match
    it("reads the list's starters, or another car's, as typed", () => {
      expect(questionSource([askOnPage(CHAT_SUGGESTIONS[0]!)], reviews)).toBe(
        'typed',
      )
      expect(
        questionSource(
          [askOnPage('Dugar hann?', 'tesla-model-3-afturhjoladrif')],
          reviews,
        ),
      ).toBe('typed')
    })

    it('logs the page by its slug, and no page for one no car has', () => {
      expect(carPage([askOnPage('x', 'KIA-EV3-LONG-RANGE')])).toBe(slug)
      expect(carPage([askOnPage('x', 'no-such-car')])).toBeUndefined()
      expect(carPage([ask('x')])).toBeUndefined()
    })
  })

  it('reads anything else as typed', () => {
    expect(questionSource([ask('awd undir 6 mill')])).toBe('typed')
  })

  // An older answer's follow-ups were not on offer when this was asked
  it('reads a follow-up from an earlier answer as typed', () => {
    const later: ChatMessage = { ...answer, id: 'a2', metadata: undefined }
    expect(
      questionSource([
        ask('x', 'q1'),
        answer,
        ask('y', 'q2'),
        later,
        ask('Hvað fer hann langt?', 'q3'),
      ]),
    ).toBe('typed')
  })
})
