import { Availability, Drive, NewCar } from '../types'
import newCars from './newCars'
import getCarId from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import { grantAmount, grantPriceCeiling } from './globals'

// The wire format /api/cars publishes. It is deliberately not `NewCar`: a
// consumer outside this repo has no AGENTS.md telling it that `price` is the
// list price and that everything user-facing goes through getPriceWithGrant,
// so a field named `price` alone is a field half of them will render wrong.
// Every number here says in its own name what it is, and the two that are
// derived rather than stored — the post-grant price and the real-world range —
// are spelled out rather than left for the reader to work out.
//
// Adding a field to NewCar does not add it here. That is the point: this shape
// is a promise to people who cannot see the commit that changes it, so it
// changes on purpose, and `carApi.test.ts` fails if a car stops satisfying it.

/**
 * What the site's own copy and the assistant both tell people: WLTP is a
 * manufacturer figure measured somewhere warmer and flatter than Iceland, and
 * real range lands well under it. These are the same bounds the assistant's
 * system prompt is given.
 */
export const realRangeLowFactor = 0.7
export const realRangeHighFactor = 0.85

export interface ApiCar {
  /** Stable across responses; the same id the site anchors the car's card to */
  id: string
  make: string
  model: string
  subModel?: string
  price: {
    currency: 'ISK'
    /** Before the grant. Almost never the number to show a buyer */
    list: number
    /** What the buyer pays, and what the site displays, sorts and filters on */
    withGrant: number
    /** 0 when the car is over the ceiling and gets nothing */
    grantApplied: number
  }
  /** Manufacturer WLTP figure */
  rangeWltpKm: number
  /** WLTP scaled to Icelandic conditions. An estimate, not a measurement */
  estimatedRealRangeKm: { min: number; max: number }
  batteryCapacityKwh: number
  acceleration0To100S: number
  powerKw: number
  drive: Drive
  fastCharge: {
    minutes10To80: number
    /** Range added per minute on a fast charger, at the low real-range factor */
    kmPerMinute: number
  }
  /** `expected` means it is not on the road here yet */
  availability: Availability
  /** Icelandic, e.g. "sumar 2026". Only on an `expected` car */
  expectedDelivery?: string
  sellerUrl: string
  evDatabaseUrl?: string
  /** Relative to this response's origin */
  imagePath: string
  /** Relative to this response's origin; deep-links to the car on the site */
  pagePath: string
}

export const toApiCar = (car: NewCar): ApiCar => {
  const withGrant = getPriceWithGrant(car.price)

  return {
    id: getCarId(car),
    make: car.make,
    model: car.model,
    ...(car.subModel ? { subModel: car.subModel } : {}),
    price: {
      currency: 'ISK',
      list: car.price,
      withGrant,
      grantApplied: car.price - withGrant,
    },
    rangeWltpKm: car.range,
    estimatedRealRangeKm: {
      min: Math.round(car.range * realRangeLowFactor),
      max: Math.round(car.range * realRangeHighFactor),
    },
    batteryCapacityKwh: car.capacity,
    acceleration0To100S: car.acceleration,
    powerKw: car.power,
    drive: car.drive,
    fastCharge: {
      minutes10To80: car.timeToCharge10T080,
      // The helper returns a fixed-precision string, as the list UI wants it
      kmPerMinute: Number(
        getKmPerMinutesCharged(car.timeToCharge10T080, car.range),
      ),
    },
    availability: car.expectedDelivery ? 'expected' : 'available',
    ...(car.expectedDelivery ? { expectedDelivery: car.expectedDelivery } : {}),
    sellerUrl: car.sellerURL,
    ...(car.evDatabaseURL ? { evDatabaseUrl: car.evDatabaseURL } : {}),
    imagePath: `/images/${car.heroImageName}.jpg`,
    pagePath: `/#${getCarId(car)}`,
  }
}

export interface CarsPayload {
  source: {
    name: string
    description: string
    operator: string
    repository: string
    attribution: string
  }
  /** The same caveat the site puts under its intro, for a reader who only has this */
  disclaimer: string
  /** When this document was built. The list is rebuilt on every deploy, and a
   *  deploy is what a price change is, so this doubles as the data's age */
  generatedAt: string
  /** The commit the data came from, when the platform says what it is */
  commit?: string
  grant: {
    name: string
    currency: 'ISK'
    amount: number
    /** List price at or above this gets nothing. Exclusive */
    priceCeiling: number
    note: string
  }
  notes: {
    range: string
    fastCharge: string
    paths: string
  }
  count: number
  cars: Array<ApiCar>
}

export const buildCarsPayload = (
  generatedAt: Date,
  commit?: string,
): CarsPayload => ({
  source: {
    name: 'Veldu Rafbíl',
    description:
      'Every 100% electric car sold new in Iceland, with prices, range and charging figures',
    operator: 'Hugi Hlynsson',
    repository: 'https://github.com/hugihlynsson/veldu-rafbil',
    attribution:
      'Free to use. Please credit Veldu Rafbíl and link back to the site.',
  },
  disclaimer:
    'Veldu Rafbíl is run as a non-profit community service. The car list is maintained by hand from sellers’ published price lists, so prices and availability can be out of date. Check with the seller before relying on a figure.',
  generatedAt: generatedAt.toISOString(),
  ...(commit ? { commit } : {}),
  grant: {
    name: 'Rafbílastyrkur',
    currency: 'ISK',
    amount: grantAmount,
    priceCeiling: grantPriceCeiling,
    note: `A new electric car with a list price under ${grantPriceCeiling.toLocaleString('en-US')} ISK has ${grantAmount.toLocaleString('en-US')} ISK taken off. Both numbers are set by Icelandic legislation and have changed before. price.withGrant is what a buyer pays and what the site shows; price.list is the price before it.`,
  },
  notes: {
    range: `rangeWltpKm is the manufacturer WLTP figure. Real range in Iceland is lower — cold, wind and hills — and usually lands between ${Math.round(realRangeLowFactor * 100)}% and ${Math.round(realRangeHighFactor * 100)}% of it, which is what estimatedRealRangeKm reports. Those are estimates, not measurements.`,
    fastCharge: `minutes10To80 is the time from 10% to 80% on a fast charger. kmPerMinute is derived from it and from range at the ${Math.round(realRangeLowFactor * 100)}% factor.`,
    paths:
      'imagePath and pagePath are relative to the origin this document was served from.',
  },
  count: newCars.length,
  cars: newCars.map(toApiCar),
})
