import type { Car } from '@/modules/data/cars'
import carReviews from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'
import type { ChatMessage } from '@/modules/chat/message'
import { resolveSlugs } from '@/modules/detail/slugs'
import { peekVerdict } from '@/app/api/verdict/[...slugs]/verdict'

interface Written {
  paragraphs: ReadonlyArray<string>
}

const listNames = (names: ReadonlyArray<string>) =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} og ${names.at(-1)}`

/**
 * What the model is told about the page a question was asked on: a car's, or
 * a comparison. With the review or summary on it, as the reader takes it for
 * the advisor's own and may ask about it.
 */
export const pageNote = (
  cars: ReadonlyArray<Car>,
  written: Written | null,
): string => {
  const text = written && `"${written.paragraphs.join(' ')}"`
  const [page, said] =
    cars.length === 1
      ? [
          `[Spurt á síðu bílsins ${cars[0].label} á Veldu Rafbíl.`,
          text && `Á síðunni er umsögn sem þú skrifaðir um hann: ${text}`,
        ]
      : [
          `[Spurt á samanburðarsíðu Veldu Rafbíl, þar sem notandinn ber saman ${listNames(cars.map((car) => car.label))}.`,
          text && `Efst á síðunni er samantekt sem þú skrifaðir um þá: ${text}`,
        ]
  return [page, said, ']'].filter(Boolean).join(' ')
}

// A car's review is kept with the data; a comparison's summary is in the cache
// once someone has opened it
const readWritten = async (
  cars: ReadonlyArray<Car>,
): Promise<Written | null> =>
  cars.length === 1 ? (carReviews[carSlug(cars[0])] ?? null) : peekVerdict(cars)

/**
 * The conversation with each question asked on a car's page or a comparison
 * carrying a note of which. Added to the question rather than the system
 * prompt, which has to stay the same for the provider's prompt cache. The
 * review or summary goes with the newest only, as it is the one the reader is
 * looking at.
 */
export const withPageContext = async (
  messages: ChatMessage[],
  read: (cars: ReadonlyArray<Car>) => Promise<Written | null> = readWritten,
): Promise<ChatMessage[]> => {
  const lastQuestion = messages.findLastIndex(({ role }) => role === 'user')

  return Promise.all(
    messages.map(async (message, index) => {
      const about = message.metadata?.about
      if (message.role !== 'user' || !about) return message

      const { cars } = resolveSlugs(about)
      if (cars.length === 0) return message

      const written = index === lastQuestion ? await read(cars) : null
      return {
        ...message,
        parts: [
          { type: 'text' as const, text: pageNote(cars, written) },
          ...message.parts,
        ],
      }
    }),
  )
}
