import cars, { Car } from './cars'

// Lowercased once: an answer is searched for every car in the list every time
// the row under it renders
const carNames = cars.map((car) => `${car.make} ${car.model}`.toLowerCase())

/** In list order, for the row of MiniCars under an answer */
export const findMentionedCars = (text: string): Car[] => {
  const lowerText = text.toLowerCase()
  // A subModel only ever extends the name, so make and model answer for both
  return cars.filter((_car, index) => lowerText.includes(carNames[index]))
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
