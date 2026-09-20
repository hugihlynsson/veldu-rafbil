import { Availability, Drive, NewCar } from '../types'
import newCars from './newCars'
import getCarId from './getCarId'
import getPriceWithGrant from './getPriceWithGrant'
import getKmPerMinutesCharged from './getKmPerMinutesCharged'
import { grantAmount, grantPriceCeiling } from './globals'

// The same bounds the assistant's system prompt is given for Icelandic driving
export const realRangeLowFactor = 0.7
export const realRangeHighFactor = 0.85

// Not NewCar: a consumer has no AGENTS.md telling it that `price` is the list
// price, so each field is named for what it is and the derived ones published.
// Adding a field to NewCar does not add it here.
export interface ApiCar {
  id: string
  make: string
  model: string
  subModel?: string
  // `withGrant` is what a buyer pays and what the site shows everywhere
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
  count: newCars.length,
  cars: newCars.map(toApiCar),
})
