import type { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'

// Below these a car is not told apart from the others by it
const MIN_PRICE_GAP = 100_000
const MIN_RANGE_GAP = 20
const MIN_CHARGE_GAP = 3
const MIN_TOWING_GAP = 300
// Within this share of the compared cars' price and range, a car is like them
const LIKE_SHARE = 0.05

// What the comparison has the car beat, in the nominative a comparative takes
const thanAll = (count: number): string =>
  count === 2 ? ' en báðir' : count === 3 ? ' en allir þrír' : ''

/**
 * Why a car is offered beside these: the first thing it does better than all
 * of them, in the order a buyer weighs them, or that it sits between or
 * close to them.
 * Nothing when it does neither, rather than a reason that is not one.
 */
export const addReason = (
  car: Car,
  compared: ReadonlyArray<Car>,
): string | undefined => {
  if (compared.length === 0) return undefined
  const than = thanAll(compared.length)
  const prices = compared.map((other) => other.priceWithGrant)
  const ranges = compared.map((other) => other.range)

  if (car.seats > Math.max(...compared.map((other) => other.seats))) {
    return `${car.seats} sæti`
  }

  const cheaper = Math.min(...prices) - car.priceWithGrant
  if (cheaper >= MIN_PRICE_GAP) {
    return `${addDecimalSeparators(cheaper)} kr. ódýrari${than}`
  }

  const further = car.range - Math.max(...ranges)
  if (further >= MIN_RANGE_GAP) {
    return `${addDecimalSeparators(further)} km meiri drægni${than}`
  }

  const quicker =
    Math.min(...compared.map((other) => other.timeToCharge10To80)) -
    car.timeToCharge10To80
  if (quicker >= MIN_CHARGE_GAP) {
    return `Hleðst ${Math.round(quicker)} mín. hraðar${than}`
  }

  // Only against figures that are known: a missing one may be the larger
  const towings = compared.map((other) => other.towing)
  if (car.towing !== null && towings.every((towing) => towing !== null)) {
    const heavier = car.towing - Math.max(...towings)
    if (heavier >= MIN_TOWING_GAP) {
      return `Dregur ${addDecimalSeparators(heavier)} kg meira${than}`
    }
  }

  const within = (value: number, values: number[], share = 0) =>
    value >= Math.min(...values) * (1 - share) &&
    value <= Math.max(...values) * (1 + share)
  if (
    compared.length > 1 &&
    within(car.priceWithGrant, prices) &&
    within(car.range, ranges)
  ) {
    return 'Á milli þeirra í verði og drægni'
  }
  if (
    within(car.priceWithGrant, prices, LIKE_SHARE) &&
    within(car.range, ranges, LIKE_SHARE)
  ) {
    return 'Svipaður í verði og drægni'
  }

  return undefined
}
