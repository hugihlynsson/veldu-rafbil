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
 * The ids of the cars an answer's [compare:] marker names, in its order: the
 * first marker only, as an answer makes one comparison. None unless at least
 * MIN_COMPARED of them are real, and no more than the comparison shows.
 */
export const resolveComparison = (markers: string[]): string[] => {
  const [marker] = markers
  if (!marker) return []
  const ids = resolveCarRefs(marker.split(/[,|]/).map((ref) => ref.trim()))
  return ids.length >= MIN_COMPARED ? ids.slice(0, MAX_COMPARED) : []
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

// An answer that compares tags at most MAX_COMPARED cars, as the prompt asks,
// so all of them fit; one that tags more is recommending, best first, and
// three are enough to choose between
export const COMPARED_FROM_ANSWER = 3

/**
 * The cars the last answer's comparison link compares: the ones its
 * [compare:] marker names. An answer without one, or stored before there was
 * one, falls back to the cars it tags, read off how many, not the question's
 * wording. None when the last message is not an answer, or is about one car
 * or none.
 */
export const getAnswerComparison = (
  messages: ReadonlyArray<ChatMessage>,
): Car[] => {
  const answer = messages.at(-1)
  if (answer?.role !== 'assistant') return []
  const compared = (answer.metadata?.comparison ?? []).flatMap(
    (id) => carsById.get(id) ?? [],
  )
  if (compared.length >= MIN_COMPARED) return compared
  const cars = getAnswerCars(answer)
  const answerCars =
    cars.length > MAX_COMPARED ? cars.slice(0, COMPARED_FROM_ANSWER) : cars
  return answerCars.length >= MIN_COMPARED ? answerCars : []
}
