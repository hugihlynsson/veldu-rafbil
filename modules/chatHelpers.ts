import newCars from './newCars'
import getCarId from './getCarId'
import { NewCar } from '../types'

// The cars an answer talks about, in the order they appear in the list, for the
// row of MiniCars under it
export const findMentionedCars = (text: string): NewCar[] => {
  const mentioned: NewCar[] = []
  const seen = new Set<string>()
  const lowerText = text.toLowerCase()

  for (const car of newCars) {
    const carName = `${car.make} ${car.model}`.toLowerCase()
    const carNameWithSub = car.subModel
      ? `${car.make} ${car.model} ${car.subModel}`.toLowerCase()
      : null

    const isMentioned =
      lowerText.includes(carName) ||
      (carNameWithSub !== null && lowerText.includes(carNameWithSub))

    // The same identity the row keys itself by, so that what counts as one car
    // here and what counts as one car there cannot drift apart
    const id = getCarId(car)
    if (isMentioned && !seen.has(id)) {
      seen.add(id)
      mentioned.push(car)
    }
  }

  return mentioned
}

// Fisher-Yates. sort() with a random comparator looks like a shuffle but is
// not one: the result depends on the sort algorithm and leans towards leaving
// things where they started, so the same few suggestions kept coming up.
export const getRandomSuggestions = (
  suggestions: string[],
  count: number = 3,
): string[] => {
  const shuffled = [...suggestions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// Parse follow-up suggestions from text in [q:<question>] format
export const parseFollowUps = (text: string): string[] => {
  const followUpRegex = /\[q:([^\]]+)\]/g
  const matches = [...text.matchAll(followUpRegex)]
  return matches.map((match) => match[1].trim())
}

// Remove follow-up markers from text
// Handles both complete [q:text] and incomplete [q:text (strips everything after [q: if ] is missing)
export const stripFollowUps = (text: string): string => {
  // First remove complete tags [q:text]
  let result = text.replace(/\[q:[^\]]+\]/g, '')
  // Then remove incomplete tags - everything from [q: to the end
  result = result.replace(/\[q:.*$/gs, '')
  return result.trim()
}
