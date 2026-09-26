import { APICallError } from 'ai'
import { describe, expect, it } from 'vitest'

import type { ChatMessage } from './chatMessage'
import {
  isAwaitingText,
  rateLimitedText,
  unansweredReason,
} from './chatProgress'

const question: ChatMessage = {
  id: 'q1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hvaða bíll fer lengst?' }],
}

const answer: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  parts: [{ type: 'step-start' }, { type: 'text', text: 'Þessi.' }],
}

const toolCallOnly: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  parts: [{ type: 'step-start' }],
}

// What useChat throws for a response that is not ok
const failedWith = (statusCode: number) =>
  new APICallError({
    message: 'failed',
    url: '/api/chat',
    requestBodyValues: undefined,
    statusCode,
  })

describe('isAwaitingText', () => {
  it('waits while the question is on its way', () => {
    expect(isAwaitingText([question], 'submitted')).toBe(true)
  })

  it('waits through a step with no text yet', () => {
    expect(isAwaitingText([question, toolCallOnly], 'streaming')).toBe(true)
  })

  it('stops once the answer has text to show', () => {
    expect(isAwaitingText([question, answer], 'streaming')).toBe(false)
  })

  // A question read back from storage has nothing on its way, and waiting on
  // it showed the typing indicator for good
  it('does not wait on a question nothing is answering', () => {
    expect(isAwaitingText([question], 'ready')).toBe(false)
    expect(isAwaitingText([question], 'error')).toBe(false)
  })
})

describe('unansweredReason', () => {
  it('is nothing for an answered question', () => {
    expect(unansweredReason([question, answer], 'ready', undefined)).toBe(null)
  })

  it('is nothing while an answer is coming', () => {
    expect(unansweredReason([question], 'submitted', undefined)).toBe(null)
    expect(unansweredReason([question], 'streaming', undefined)).toBe(null)
  })

  it('names a question stored without its answer', () => {
    expect(unansweredReason([question], 'ready', undefined)).toBe(
      'Spurningunni var ekki svarað',
    )
  })

  it('says so when the route turned the question away for the rate', () => {
    expect(unansweredReason([question], 'error', failedWith(429))).toBe(
      rateLimitedText,
    )
  })

  it('apologises for any other failure', () => {
    expect(unansweredReason([question], 'error', failedWith(500))).toBe(
      'Úps, eitthvað fór úrskeiðis',
    )
    expect(unansweredReason([question], 'error', new Error('offline'))).toBe(
      'Úps, eitthvað fór úrskeiðis',
    )
  })
})
