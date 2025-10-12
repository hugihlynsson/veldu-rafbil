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
