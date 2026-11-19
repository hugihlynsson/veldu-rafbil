import cars, { currentCarWithSlug, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { MAX_COMPARED, MIN_COMPARED } from '@/modules/detail/comparison'
import { findMentionedCars } from './mentionedCars'
import { getMessageText, MAX_TAGGED_CARS, type ChatMessage } from './message'

/**
 * What the prompt gives the model to tag a car with: its id less the `car-`
 * every id starts with. The id rather than a number in the list, so a ref
 * misremembered names no car and is dropped, where a wrong number would show
 * the wrong one.
 */
export const carRef = (car: Car): string => carSlug(car)

const carsById = new Map(cars.map((car) => [car.id, car]))

/** The ids of the cars an answer tagged, in its order, each real and once */
export const resolveCarRefs = (refs: string[]): string[] => {
  const ids = refs.flatMap(
    (ref) => currentCarWithSlug(ref.toLowerCase())?.id ?? [],
  )
  return [...new Set(ids)].slice(0, MAX_TAGGED_CARS)
}

/**
 * The cars to show under an answer: the ones the model tagged, best first.
 * An answer from before it tagged any, or one it tagged none in, falls back
 * to the cars its text names.
 */
export const getAnswerCars = (message: ChatMessage): Car[] => {
  // A stored answer can name a car that has since left the list
  const tagged = (message.metadata?.cars ?? []).flatMap(
    (id) => carsById.get(id) ?? [],
  )
  return tagged.length > 0 ? tagged : findMentionedCars(getMessageText(message))
}

// Three is enough to choose between, and the most a comparison shows in
// columns without crowding a phone
export const COMPARED_FROM_ANSWER = 3

// "Berðu saman", "samanburðinn", "vs", or a table the chat has been keeping:
// a question asking for the cars side by side, which can name a fourth
const comparisonAsked = /(?<!\p{L})(saman|tafl|töfl|vs(?!\p{L}))/iu

/** Whether a question asks for its cars side by side */
export const asksToCompare = (question: string): boolean =>
  comparisonAsked.test(question)

/**
 * The cars the last answer's comparison link compares: the first it tags, as
 * it lists them best first — every car it compared, when the question asked
 * for a comparison. None when the last message is not an answer, or is about
 * one car or none.
 */
export const getAnswerComparison = (
  messages: ReadonlyArray<ChatMessage>,
): Car[] => {
  const answer = messages.at(-1)
  if (answer?.role !== 'assistant') return []
  const question = messages.findLast((message) => message.role === 'user')
  const most = asksToCompare(getMessageText(question))
    ? MAX_COMPARED
    : COMPARED_FROM_ANSWER
  const answerCars = getAnswerCars(answer).slice(0, most)
  return answerCars.length >= MIN_COMPARED ? answerCars : []
}
