import { Availability, Drive } from '@/types'
import cars, { Car } from './cars'
import { grantAmount, grantPriceCeiling } from './globals'

// The same bounds the assistant's system prompt is given for Icelandic driving
export const realRangeLowFactor = 0.7
export const realRangeHighFactor = 0.85

// Not NewCar: a consumer has no AGENTS.md telling it that `price` is the list
// price, so each field is named for what it is and the derived ones published.
// Adding a field to NewCar does not add it here — this shape is a promise to
// people who cannot see the commit that changes it, so it changes on purpose.
export interface ApiCar {
  id: string
  make: string
  model: string
  subModel?: string
  // `withGrant` is what a buyer pays and what the site shows everywhere. Both
  // are published because most of the list qualifies, so a lone `price` would
  // be the wrong number more often than not.
  price: {
    currency: 'ISK'
    list: number
    withGrant: number
    grantApplied: number
  }
  rangeWltpKm: number
  estimatedRealRangeKm: { min: number; max: number }
  batteryCapacityKwh: number
  acceleration0To100S: number
  powerKw: number
  drive: Drive
  // The most seats the model can be ordered with in Iceland, a third row that
  // costs extra included. `price` is the cheapest trim's, so seating this many
  // can cost more than the figure beside it.
  seats: number
  fastCharge: {
    minutes10To80: number
    kmPerMinute: number
  }
  availability: Availability
  // Icelandic, e.g. "sumar 2026", and only on an `expected` car
  expectedDelivery?: string
  sellerUrl: string
  evDatabaseUrl?: string
  // Relative to the origin this was served from
  pagePath: string
}

// The photos stay unpublished: a path to them invites hotlinking and the bill
// lands on the image optimiser. Serving them later means a CDN URL, a new field.
export const toApiCar = (car: Car): ApiCar => ({
  id: car.id,
  make: car.make,
  model: car.model,
  ...(car.subModel ? { subModel: car.subModel } : {}),
  price: {
    currency: 'ISK',
    list: car.price,
    withGrant: car.priceWithGrant,
    grantApplied: car.price - car.priceWithGrant,
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
  seats: car.seats,
  fastCharge: {
    minutes10To80: car.timeToCharge10To80,
    kmPerMinute: car.kmPerMinuteCharged,
  },
  availability: car.availability,
  ...(car.expectedDelivery ? { expectedDelivery: car.expectedDelivery } : {}),
  sellerUrl: car.sellerUrl,
  ...(car.evDatabaseUrl ? { evDatabaseUrl: car.evDatabaseUrl } : {}),
  pagePath: `/#${car.id}`,
})

export interface CarsPayload {
  source: {
    name: string
    description: string
    operator: string
    repository: string
    attribution: string
  }
  disclaimer: string
  generatedAt: string
  commit?: string
  grant: {
    name: string
    currency: 'ISK'
    amount: number
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

// The caveats ride in the envelope so a reader holding only this knows how old
// the figures are and what they mean
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
    paths: 'pagePath is relative to the origin this document was served from.',
  },
  count: cars.length,
  cars: cars.map(toApiCar),
})
