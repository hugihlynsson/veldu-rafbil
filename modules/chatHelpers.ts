import cars, { Car } from './cars'

interface Model {
  base?: Car
  variants: Car[]
}

// What a name in an answer points at: one variant, or a model named bare
interface Name {
  model: Model
  variant?: Car
}

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const nameKey = (name: string) => name.toLowerCase().replace(/\s+/g, ' ')

// A name is whole only where no letter or digit runs on from it, so "i4" is
// not found in "Ni4", while "EV3-bílinn" still names the EV3. The edge is
// captured rather than looked behind for, which older Safari cannot parse.
const namePattern = (names: string[]) =>
  `(^|[^\\p{L}\\p{N}])(${names
    .map((name) => escapeRegExp(name).replace(/ /g, '\\s+'))
    .join('|')})(?![\\p{L}\\p{N}])`

const models = new Map<string, Model>()
for (const car of cars) {
  const key = nameKey(`${car.make} ${car.model}`)
  const model = models.get(key) ?? { variants: [] }
  model.variants.push(car)
  if (!car.subModel) model.base = car
  models.set(key, model)
}

// An answer often drops the make ("EV3", "Model Y", "ID.4"), so a model goes
// without it when it reads as a name rather than a number or a letter, and no
// other make's car answers to it — not Polestar's "3", nor Range Rover's
// "Electric", which is also half of "Kona Electric"
const standsAlone = (car: Car): boolean => {
  if (!/\p{L}/u.test(car.model)) return false
  if (!/\d/.test(car.model) && car.model.length < 3) return false
  const pattern = new RegExp(namePattern([nameKey(car.model)]), 'u')
  return !cars.some(
    (other) => other.make !== car.make && pattern.test(nameKey(other.label)),
  )
}

const names = new Map<string, Name>()
for (const model of models.values()) {
  const [{ make, model: modelName }] = model.variants
  const prefixes = [`${make} `]
  if (standsAlone(model.variants[0])) prefixes.push('')

  for (const prefix of prefixes) {
    names.set(nameKey(`${prefix}${modelName}`), { model })
    for (const variant of model.variants) {
      if (variant.subModel) {
        names.set(nameKey(`${prefix}${modelName} ${variant.subModel}`), {
          model,
          variant,
        })
      }
    }
  }
}

// Longest first, so at any one place "EX30 Cross Country" is taken over
// "EX30" and "Kia EV3 Long Range AWD" over "Kia EV3 Long Range"
const mentionPattern = new RegExp(
  namePattern([...names.keys()].sort((a, b) => b.length - a.length)),
  'gu',
)

/** In the order the answer names them, for the row of MiniCars under it */
export const findMentionedCars = (text: string): Car[] => {
  const mentions = [...text.toLowerCase().matchAll(mentionPattern)].map(
    (match) => names.get(nameKey(match[2]))!,
  )
  const namedVariantOf = new Set(
    mentions.filter((name) => name.variant).map((name) => name.model),
  )

  // A model named bare is the car whose label that is when it has one.
  // Otherwise it is all of its variants, unless the answer names one of them
  // elsewhere, since then that is the one it is recommending.
  const found = mentions.flatMap(({ model, variant }): Car[] => {
    if (variant) return [variant]
    if (model.base) return [model.base]
    return namedVariantOf.has(model) ? [] : model.variants
  })

  return [...new Set(found)]
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
