import newCars from './newCars'
import getCarId from './getCarId'
import { NewCar } from '../types'

// In list order, for the row of MiniCars under an answer
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

    // The same identity the row keys itself by, so the two cannot drift apart
    const id = getCarId(car)
    if (isMentioned && !seen.has(id)) {
      seen.add(id)
      mentioned.push(car)
    }
  }

  return mentioned
}

// Fisher-Yates — sort() with a random comparator is not a shuffle
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

// [q:<question>] markers the model appends as follow-up suggestions
export const parseFollowUps = (text: string): string[] => {
  const followUpRegex = /\[q:([^\]]+)\]/g
  const matches = [...text.matchAll(followUpRegex)]
  return matches.map((match) => match[1].trim())
}

// A marker can arrive mid-stream, cut off before its closing ]
export const stripFollowUps = (text: string): string => {
  let result = text.replace(/\[q:[^\]]+\]/g, '')
  result = result.replace(/\[q:.*$/gs, '')
  return result.trim()
}
