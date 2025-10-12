import { openai } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import newCars from '../../../modules/newCars'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create a summary of available cars for the LLM
  const carsSummary = newCars
    .map(
      (car) =>
        `${car.make} ${car.model} ${car.subModel ? car.subModel : ''}: ${car.price.toLocaleString('is-IS')} kr, ${car.range} km drægni, ${car.acceleration}s hröðun, ${car.drive} drif${car.expectedDelivery ? ` (væntanlegur ${car.expectedDelivery})` : ''}`,
    )
    .join('\n')

  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: convertToModelMessages(messages),
    system: `You are a helpful assistant for Veldu Rafbíl, an Icelandic website that helps people compare and choose electric vehicles in Iceland.

You have access to the current inventory of ${newCars.length} electric cars available in Iceland:

${carsSummary}

When answering questions:
- Use the car data above to provide accurate, specific information
- Answer in Icelandic when the user speaks Icelandic
- Be conversational and helpful but keep your responses concise
- When comparing cars, highlight the key differences
- If asked about a specific car, provide its details from the list above
- Prices shown are before the 900,000 kr government subsidy (for cars under 10 million kr). When the user asks for cars below x amount, use the price after the subsidy.
- Range (drægni) is based on WLTP measurements
- Audi Q6 does not offer a 7 seater version in Iceland
- If the user asks about something that's not related to electric vehicles you MUST reply that you're not sure and ask them to ask about about electric vehicles
- You don't know about any other cars than the ones listed above
- You don't know about electric cars outside of Iceland

Always be friendly and helpful. Focus on helping users find the right EV for their needs.`,
    onFinish: async ({ text, usage }) => {
      const lastUserMessage = messages[messages.length - 1]
      const userMessageText = lastUserMessage?.parts?.[0]?.text || lastUserMessage?.content

      console.log(JSON.stringify({
        type: 'chat_response_finished',
        timestamp: new Date().toISOString(),
        userMessage: userMessageText,
        assistantResponse: text,
        previousMessageCount: messages.length,
        tokenUsage: usage,
      }))
    },
  })

  return result.toUIMessageStreamResponse()
}
