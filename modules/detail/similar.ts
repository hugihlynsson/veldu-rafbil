import cars, { currentCarWithSlug, type Car } from '@/modules/data/cars'
import { carSlug } from '@/modules/data/getCarId'
import similarCars from '@/modules/data/similarCars'

export const SIMILAR_COUNT = 3

// How far apart two cars are, as a buyer weighing one would see it: price
// first, range next, and a different number of seats as a different need.
// Ratios rather than differences, so 500.000 kr. is a lot on a small car and
// little on a large one.
const distance = (car: Car, other: Car): number =>
  Math.abs(Math.log(other.priceWithGrant / car.priceWithGrant)) +
  0.5 * Math.abs(Math.log(other.range / car.range)) +
  (Math.abs(other.seats - car.seats) >= 2 ? 0.5 : 0)

// A body style named onto the model, as the CLA Shooting Brake is onto the
// CLA, is the same car to someone choosing between makes
const sameModel = (a: Car, b: Car) =>
  a.make === b.make &&
  (a.model === b.model ||
    a.model.startsWith(`${b.model} `) ||
    b.model.startsWith(`${a.model} `))

// Never another variant of a model already there, which is a choice within
// the car rather than against it, and one variant of each other
const rankModels = (
  among: ReadonlyArray<Car>,
  taken: ReadonlyArray<Car>,
  score: (other: Car) => number,
): Car[] =>
  among
    .filter((other) => !taken.some((car) => sameModel(car, other)))
    .map((other) => ({ other, score: score(other) }))
    .toSorted(
      (a, b) => a.score - b.score || a.other.id.localeCompare(b.other.id),
    )
    .map(({ other }) => other)
    .filter(
      (other, index, ranked) =>
        ranked.findIndex((closer) => sameModel(closer, other)) === index,
    )

/**
 * The cars closest to this one, closest first: what scripts/similar-cars.ts
 * writes into the similar-cars list
 */
export const closestCars = (
  car: Car,
  among: ReadonlyArray<Car> = cars,
  count: number = SIMILAR_COUNT,
): Car[] =>
  rankModels(among, [car], (other) => distance(car, other)).slice(0, count)

/**
 * The cars someone looking at this one would weigh it against, as the
 * similar-cars list has them: worked out once and kept, so they hold still
 * as other cars come and go, and can be set by hand
 */
export const similarTo = (car: Car): Car[] =>
  (similarCars[carSlug(car)] ?? []).flatMap(
    (slug) => currentCarWithSlug(slug) ?? [],
  )

// Tuned on the comparisons people opened, holding one car out of each and
// ranking it from the rest: scripts/eval-similar.ts, which re-runs it, has
// the held-out car among the first four 36% of the time, to 21% from the
// first car alone. Averaging over the selection, leaning on its nearest car
// and on the hand-picked lists each added to that. Requiring a car to sit
// between the selected ones on every figure, or near the worst matched of
// them, did worse: people compare more widely than that. Ground clearance,
// power, drive and make each moved it within noise. Re-run it before
// changing these.
const NEAREST_SHARE = 0.3
const LISTED_BONUS = 0.15

/**
 * The cars to offer beside these ones, best first: near all of them in price,
 * range and seats, and nearer still where one of them lists it as similar
 */
export const closestToSelection = (
  selected: ReadonlyArray<Car>,
  count: number,
  among: ReadonlyArray<Car> = cars,
  listedFor: (car: Car) => ReadonlyArray<Car> = similarTo,
): Car[] => {
  if (selected.length === 0) return []
  const listed = new Set(selected.flatMap(listedFor).map((car) => car.id))

  return rankModels(among, selected, (other) => {
    const distances = selected.map((car) => distance(car, other))
    const mean = distances.reduce((sum, d) => sum + d, 0) / distances.length
    return (
      (1 - NEAREST_SHARE) * mean +
      NEAREST_SHARE * Math.min(...distances) -
      (listed.has(other.id) ? LISTED_BONUS : 0)
    )
  }).slice(0, count)
}
