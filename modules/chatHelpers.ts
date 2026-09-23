import { UIMessage } from 'ai'

import cars, { Car } from './cars'

/**
 * The text of a message. A message is a list of parts, only some of them text,
 * and everything here — the bubble, the mentioned cars, the follow-ups, what
 * is logged — wants the same joined string out of it.
 */
export const getMessageText = (message: UIMessage | undefined): string =>
  (message?.parts ?? [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ')
    .trim()

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
