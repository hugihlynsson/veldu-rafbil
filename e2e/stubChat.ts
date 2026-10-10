import type { Page } from '@playwright/test'
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'

import type { ChatMessage } from '@/modules/chat/message'

export interface Answer {
  text: string
  followUps?: string[]
  /** Car ids, as the route sends them */
  cars?: string[]
}

/**
 * Answers /api/chat with a stream the AI SDK writes itself, so the chat reads
 * it as it would the route's, and keeps what each request sent
 */
export const stubChat = async (page: Page, answer: Answer) => {
  const requests: Array<{ messages: ChatMessage[] }> = []

  await page.route('**/api/chat', async (route) => {
    requests.push(route.request().postDataJSON())
    const response = createUIMessageStreamResponse({
      stream: createUIMessageStream<ChatMessage>({
        execute: ({ writer }) => {
          writer.write({ type: 'start' })
          writer.write({ type: 'text-start', id: 'answer' })
          writer.write({ type: 'text-delta', id: 'answer', delta: answer.text })
          writer.write({ type: 'text-end', id: 'answer' })
          writer.write({
            type: 'finish',
            messageMetadata: { followUps: answer.followUps, cars: answer.cars },
          })
        },
      }),
    })
    await route.fulfill({
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.text(),
    })
  })

  return requests
}
