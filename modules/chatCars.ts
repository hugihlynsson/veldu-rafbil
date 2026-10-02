import cars, { type Car } from './cars'
import { findMentionedCars } from './chatHelpers'
import {
  getMessageText,
  MAX_TAGGED_CARS,
  type ChatMessage,
} from './chatMessage'

/**
 * What the prompt gives the model to tag a car with: its id less the `car-`
 * every id starts with. The id rather than a number in the list, so a ref
 * misremembered names no car and is dropped, where a wrong number would show
 * the wrong one.
 */
export const carRef = (car: Car): string => car.id.replace(/^car-/, '')

const carsByRef = new Map(cars.map((car) => [carRef(car), car]))
const carsById = new Map(cars.map((car) => [car.id, car]))

/** The ids of the cars an answer tagged, in its order, each real and once */
export const resolveCarRefs = (refs: string[]): string[] => {
  const ids = refs.flatMap((ref) => carsByRef.get(ref.toLowerCase())?.id ?? [])
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
