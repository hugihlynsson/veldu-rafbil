import newCars from '../modules/newCars'
import { NewCar } from '../types'

// Helper function to find cars mentioned in text
export const findMentionedCars = (text: string): NewCar[] => {
  const mentioned: NewCar[] = []
  const lowerText = text.toLowerCase()

  for (const car of newCars) {
    // Check if the message mentions this car (make + model)
    const carName = `${car.make} ${car.model}`.toLowerCase()
    const carNameWithSub = car.subModel
      ? `${car.make} ${car.model} ${car.subModel}`.toLowerCase()
      : null

    if (
      lowerText.includes(carName) ||
      (carNameWithSub && lowerText.includes(carNameWithSub))
    ) {
      // Avoid duplicates
      if (
        !mentioned.find(
          (c) =>
            c.make === car.make &&
            c.model === car.model &&
            c.subModel === car.subModel,
        )
      ) {
        mentioned.push(car)
      }
    }
  }

  return mentioned
}

// Helper to get random suggestions
export const getRandomSuggestions = (suggestions: string[], count: number = 3): string[] => {
  const shuffled = [...suggestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Parse follow-up suggestions from text in [q:<question>] format
export const parseFollowUps = (text: string): string[] => {
  const followUpRegex = /\[q:([^\]]+)\]/g
  const matches = [...text.matchAll(followUpRegex)]
  return matches.map(match => match[1].trim())
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
