/**
 * Writes modules/data/similarCars.ts: for each car, the cars closest to it in
 * price and range, which its page shows and its review is written against.
 *
 *   npx tsx scripts/similar-cars.ts         adds the cars that have no entry
 *   npx tsx scripts/similar-cars.ts --all   works every entry out afresh
 *
 * An entry already there is kept, so one set by hand survives a run that only
 * adds a new car's. One naming a car no longer on the list is worked out again.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'

import cars from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import { closestCars } from '@/modules/detail/similar'
import similarCars from '@/modules/data/similarCars'

const file = path.join(__dirname, '../modules/data/similarCars.ts')
const all = process.argv.includes('--all')

const current = new Set(cars.map(carSlug))
const existing: Readonly<Record<string, ReadonlyArray<string>>> = all
  ? {}
  : similarCars

const entries = cars.map((car) => {
  const slug = carSlug(car)
  const kept = existing[slug]
  const similar =
    kept && kept.every((other) => current.has(other))
      ? kept
      : closestCars(car).map(carSlug)
  return `  '${slug}': [${similar.map((other) => `'${other}'`).join(', ')}],`
})

writeFileSync(
  file,
  `// The cars each car's page offers as similar, and its review is written
// against, by slug. Written by scripts/similar-cars.ts, closest in price and
// range first; an entry can be set by hand, and a run that adds new cars
// keeps it. similarCars.test.ts fails while a car has none.

const similarCars: Readonly<Record<string, ReadonlyArray<string>>> = {
${entries.join('\n')}
}

export default similarCars
`,
)

console.log(
  `Wrote ${entries.length} entries to ${path.relative(process.cwd(), file)}`,
)
