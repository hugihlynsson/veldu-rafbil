import type { Car } from '@/modules/data/cars'
import type { ChatMessage } from '@/modules/chat/message'
import { resolveComparison } from '@/modules/compare/comparison'
import type { Verdict } from '@/modules/compare/verdictEvents'
import { peekVerdict } from '@/app/api/comparison/[...slugs]/verdict'

const listNames = (names: ReadonlyArray<string>) =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} og ${names.at(-1)}`

/**
 * What the model is told about the comparison a question was asked on. With
 * the summary above it on the page, as the reader takes it for the advisor's
 * own and may ask about it.
 */
export const comparisonNote = (
  compared: ReadonlyArray<Car>,
  verdict: Verdict | null,
): string =>
  [
    `[Spurt á samanburðarsíðu Veldu Rafbíl, þar sem notandinn ber saman ${listNames(compared.map((car) => car.label))}.`,
    verdict &&
      `Efst á síðunni er samantekt sem þú skrifaðir um þá: "${verdict.paragraphs.join(' ')}"`,
    ']',
  ]
    .filter(Boolean)
    .join(' ')

/**
 * The conversation with each question asked on a comparison page carrying a
 * note of which. Added to the question rather than the system prompt, which
 * has to stay the same for the provider's prompt cache. The summary goes with
 * the newest only, as it is the one the reader is looking at.
 */
export const withComparisonContext = async (
  messages: ChatMessage[],
  readVerdict: (
    compared: ReadonlyArray<Car>,
  ) => Promise<Verdict | null> = peekVerdict,
): Promise<ChatMessage[]> => {
  const lastQuestion = messages.findLastIndex(({ role }) => role === 'user')

  return Promise.all(
    messages.map(async (message, index) => {
      const comparing = message.metadata?.comparing
      if (message.role !== 'user' || !comparing) return message

      const { cars } = resolveComparison(comparing)
      if (cars.length === 0) return message

      const verdict = index === lastQuestion ? await readVerdict(cars) : null
      return {
        ...message,
        parts: [
          { type: 'text' as const, text: comparisonNote(cars, verdict) },
          ...message.parts,
        ],
      }
    }),
  )
}
