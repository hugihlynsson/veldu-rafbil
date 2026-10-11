import cars, { type Car } from '@/modules/data/cars'
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

/**
 * The cars closest to this one, closest first: what scripts/similar-cars.ts
 * writes into the similar-cars list. Never another variant of the same model,
 * which is a choice within the car rather than against it, and one variant
 * of each other.
 */
export const closestCars = (
  car: Car,
  among: ReadonlyArray<Car> = cars,
  count: number = SIMILAR_COUNT,
): Car[] =>
  among
    .filter((other) => !sameModel(car, other))
    .map((other) => ({ other, distance: distance(car, other) }))
    .toSorted(
      (a, b) => a.distance - b.distance || a.other.id.localeCompare(b.other.id),
    )
    .map(({ other }) => other)
    .filter(
      (other, index, ranked) =>
        ranked.findIndex((closer) => sameModel(closer, other)) === index,
    )
    .slice(0, count)

const carsBySlug = new Map(cars.map((car) => [carSlug(car), car]))

/**
 * The cars someone looking at this one would weigh it against, as the
 * similar-cars list has them: worked out once and kept, so they hold still
 * as other cars come and go, and can be set by hand
 */
export const similarTo = (car: Car): Car[] =>
  (similarCars[carSlug(car)] ?? []).flatMap(
    (slug) => carsBySlug.get(slug) ?? [],
  )
