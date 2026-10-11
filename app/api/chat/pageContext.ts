import type { Car } from '@/modules/data/cars'
import carReviews, { type CarReview } from '@/modules/data/carReviews'
import { carSlug } from '@/modules/data/getCarId'
import type { ChatMessage } from '@/modules/chat/message'
import { resolveSlugs } from '@/modules/detail/slugs'

/**
 * What the model is told about the car's page a question was asked on. With
 * the review on it, as the reader takes it for the advisor's own and may ask
 * about it.
 */
export const pageNote = (car: Car, review: CarReview | undefined): string =>
  [
    `[Spurt á síðu bílsins ${car.label} á Veldu Rafbíl.`,
    review &&
      `Á síðunni er umsögn sem þú skrifaðir um hann: "${review.paragraphs.join(' ')}"`,
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
export const withPageContext = (
  messages: ChatMessage[],
  reviews: Readonly<Record<string, CarReview>> = carReviews,
): ChatMessage[] => {
  const lastQuestion = messages.findLastIndex(({ role }) => role === 'user')

  return messages.map((message, index) => {
    const about = message.metadata?.about
    if (message.role !== 'user' || !about) return message

    const {
      cars: [car],
    } = resolveSlugs(about)
    if (!car) return message

    const review = index === lastQuestion ? reviews[carSlug(car)] : undefined
    return {
      ...message,
      parts: [
        { type: 'text' as const, text: pageNote(car, review) },
        ...message.parts,
      ],
    }
  })
}
