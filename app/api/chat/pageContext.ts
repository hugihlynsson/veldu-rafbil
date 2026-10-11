import type { Car } from '@/modules/data/cars'
import type { ChatMessage } from '@/modules/chat/message'
import { resolveSlugs } from '@/modules/detail/slugs'
import type { Verdict } from '@/modules/detail/verdictEvents'
import { peekVerdict } from '@/app/api/verdict/[...slugs]/verdict'

/**
 * What the model is told about the car's page a question was asked on. With
 * the review on it, as the reader takes it for the advisor's own and may ask
 * about it.
 */
export const pageNote = (car: Car, verdict: Verdict | null): string =>
  [
    `[Spurt á síðu bílsins ${car.label} á Veldu Rafbíl.`,
    verdict &&
      `Á síðunni er umsögn sem þú skrifaðir um hann: "${verdict.paragraphs.join(' ')}"`,
    ']',
  ]
    .filter(Boolean)
    .join(' ')

/**
 * The conversation with each question asked on a car's page carrying a note
 * of which. Added to the question rather than the system prompt, which
 * has to stay the same for the provider's prompt cache. The review goes with
 * the newest only, as it is the one the reader is looking at.
 */
export const withPageContext = async (
  messages: ChatMessage[],
  readVerdict: (
    cars: ReadonlyArray<Car>,
  ) => Promise<Verdict | null> = peekVerdict,
): Promise<ChatMessage[]> => {
  const lastQuestion = messages.findLastIndex(({ role }) => role === 'user')

  return Promise.all(
    messages.map(async (message, index) => {
      const about = message.metadata?.about
      if (message.role !== 'user' || !about) return message

      const { cars } = resolveSlugs(about)
      if (cars.length === 0) return message

      const verdict = index === lastQuestion ? await readVerdict(cars) : null
      return {
        ...message,
        parts: [
          { type: 'text' as const, text: pageNote(cars[0], verdict) },
          ...message.parts,
        ],
      }
    }),
  )
}
