/**
 * Scores closestToSelection against comparisons people opened: holds one car
 * out of each set in scripts/comparisonSets.json and ranks it from the rest,
 * for the third and fourth car, then from one car alone, for the second.
 *
 *   node --import ./scripts/resolve.ts scripts/eval-similar.ts
 *
 * The sets are the 3–4 car comparisons opened from the tray or the chat,
 * October–November 2026, from `comparison_opened` and `compare_more` in the
 * veldu-rafbil-events dataset. People pick partly from the similar-cars list
 * on the car pages, so that list's lead here is partly built in. A few cases
 * either way is noise: the cases share cars and are not independent.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import cars, { type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { resolveSlugs } from '@/modules/detail/slugs'
import {
  closestCars,
  closestToSelection,
  similarTo,
} from '@/modules/detail/similar'

const read = (file: string): unknown =>
  JSON.parse(readFileSync(path.join(import.meta.dirname, file), 'utf8'))

const sets = (read('comparisonSets.json') as string[][]).map((slugs) =>
  resolveSlugs(slugs).cars.filter((car) => !car.deprecated),
)

// As similar.ts counts a model: a variant is never offered beside its own
const sameModel = (a: Car, b: Car) =>
  a.make === b.make &&
  (a.model === b.model ||
    a.model.startsWith(`${b.model} `) ||
    b.model.startsWith(`${a.model} `))

interface Case {
  rest: Car[]
  held: Car
}

// Each held-out car once per set it was left out of, unless a variant of it
// is still in, which nothing should offer
const casesOf = (restSize: (size: number) => boolean): Case[] => {
  const seen = new Set<string>()
  const cases: Case[] = []
  for (const set of sets) {
    for (const held of set) {
      const rest = set.filter((car) => car !== held)
      if (!restSize(rest.length)) continue
      if (rest.some((car) => sameModel(car, held))) continue
      const key = [...rest.map((car) => car.id).toSorted(), held.id].join()
      if (seen.has(key)) continue
      seen.add(key)
      cases.push({ rest, held })
    }
  }
  return cases
}

// Every ordered pair from the sets, for the second car
const pairs: Case[] = []
const seenPairs = new Set<string>()
for (const set of sets) {
  for (const car of set) {
    for (const held of set) {
      if (car === held || sameModel(car, held)) continue
      const key = `${car.id}|${held.id}`
      if (seenPairs.has(key)) continue
      seenPairs.add(key)
      pairs.push({ rest: [car], held })
    }
  }
}

const pct = (count: number, of: number) =>
  `${Math.round((100 * count) / of)}%`.padStart(4)

const score = (
  name: string,
  cases: ReadonlyArray<Case>,
  rank: (rest: Car[]) => Car[],
) => {
  const places = cases.map(({ rest, held }) =>
    rank(rest).findIndex((car) => sameModel(car, held)),
  )
  const within = (count: number) =>
    pct(
      places.filter((place) => place >= 0 && place < count).length,
      cases.length,
    )
  const found = places.filter((place) => place >= 0).toSorted((a, b) => a - b)
  const median = found[Math.floor(found.length / 2)]
  console.log(
    `  ${name.padEnd(30)} top 2 ${within(2)}   top 4 ${within(4)}   top 10 ${within(10)}   median ${median === undefined ? '–' : median + 1}`,
  )
}

// Body type is not in the car data, so the ranking cannot see it; the details
// the reviews are written from have it, which makes a check on it from outside
const details = read('carDetails.json') as Record<string, { body?: string }>
const bodyOf = (car: Car): string | undefined => {
  const body = details[carSlug(car)]?.body
  if (!body) return undefined
  if (body === 'SUV' || body === 'MPV') return 'SUV'
  if (body.includes('Van')) return 'van'
  return 'hatchback or saloon'
}

const bodyMatch = (cases: ReadonlyArray<Case>) => {
  const tally = new Map<string, { match: number; total: number }>()
  for (const { rest } of cases) {
    const bodies = new Set(rest.map(bodyOf))
    const [body] = bodies
    if (bodies.size !== 1 || !body) continue
    const counts = tally.get(body) ?? { match: 0, total: 0 }
    for (const car of closestToSelection(rest, 4)) {
      const offered = bodyOf(car)
      if (!offered) continue
      counts.total += 1
      if (offered === body) counts.match += 1
    }
    tally.set(body, counts)
  }
  for (const [body, { match, total }] of tally) {
    console.log(
      `  beside ${body.padEnd(22)} ${pct(match, total)} of 4 offered alike`,
    )
  }
}

const all = 300
const more = casesOf((size) => size >= 2)
console.log(`Third and fourth car: ${more.length} held out`)
score('nearest the first car only', more, (rest) =>
  closestCars(rest[0]!, cars, all),
)
score('closestToSelection', more, (rest) => closestToSelection(rest, all))

console.log(`\nSecond car: ${pairs.length} pairs`)
score('similar-cars list', pairs, (rest) => similarTo(rest[0]!))
score('closestToSelection', pairs, (rest) => closestToSelection(rest, all))

console.log('\nBody type of the first four, where the selection agrees on one')
bodyMatch(more)
