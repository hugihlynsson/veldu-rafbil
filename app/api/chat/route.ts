import { openai } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    system: `You are a helpful assistant for Veldu Rafbíl, an Icelandic website that helps people compare and choose electric vehicles. You can answer questions about electric cars in general, help users understand different features, and provide guidance on choosing the right EV. Always be friendly and helpful. If asked about specific car models on the site, acknowledge that you can provide general information but recommend checking the detailed comparison table on the site for the most accurate and up-to-date specifications.`,
  })

  return result.toUIMessageStreamResponse()
}
