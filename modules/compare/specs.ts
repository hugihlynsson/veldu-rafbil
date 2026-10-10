import type { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { driveLabels } from '@/modules/data/drives'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'

interface Spec {
  label: string
  /** Which end wins, for a figure where one does */
  better?: 'higher' | 'lower'
  value?: (car: Car) => number
  text: (car: Car) => string
  detail?: (car: Car) => string | undefined
  /** Left out when no compared car has anything to say in it */
  shown?: (compared: ReadonlyArray<Car>) => boolean
}

const specs: Record<string, Spec> = {
  price: {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    text: (car) => `${addDecimalSeparators(car.priceWithGrant)} kr.`,
    // What the list's price pill says in its badge, which a column has no room for
    detail: (car) =>
      [car.expectedDelivery && 'áætlað verð', car.hasGrant && 'með styrk']
        .filter(Boolean)
        .join(' ') || undefined,
  },
  range: {
    label: 'Drægni',
    better: 'higher',
    value: (car) => car.range,
    text: (car) => `${car.range} km`,
    detail: () => 'WLTP',
  },
  value: {
    label: 'Verð á km drægni',
    better: 'lower',
    value: (car) => car.pricePerKm,
    text: (car) => `${addDecimalSeparators(Math.round(car.pricePerKm))} kr.`,
  },
  capacity: {
    label: 'Rafhlaða',
    better: 'higher',
    value: (car) => car.capacity,
    text: (car) => `${car.capacity} kWh`,
  },
  charging: {
    label: 'Hraðhleðsla',
    better: 'higher',
    value: (car) => car.kmPerMinuteCharged,
    text: (car) => `${formatKmPerMinute(car.kmPerMinuteCharged)} km/min`,
    detail: (car) => `10–80% á ${car.timeToCharge10To80} mín`,
  },
  acceleration: {
    label: '0-100 km/klst',
    better: 'lower',
    value: (car) => car.acceleration,
    text: (car) => `${car.acceleration.toFixed(1)}s`,
  },
  power: {
    label: 'Afl',
    better: 'higher',
    value: (car) => car.power,
    text: (car) => `${car.power} kW`,
    detail: (car) => `${Math.round(car.power * 1.34102)} hö`,
  },
  drive: {
    label: 'Drif',
    // A soft hyphen, as four columns on a phone are narrower than the word
    text: (car) => driveLabels[car.drive].replace('hjóla', 'hjóla\u00AD'),
  },
  // Not ranked: a seventh seat is no use to most, and costs extra. The most
  // the car can be ordered with, as everywhere on the site.
  seats: {
    label: 'Sæti',
    text: (car) => String(car.seats),
  },
  delivery: {
    label: 'Afhending',
    text: (car) =>
      car.expectedDelivery
        ? `Væntanlegur ${car.expectedDelivery.toLowerCase()}`
        : 'Í sölu',
    shown: (compared) => compared.some((car) => car.expectedDelivery),
  },
}

export interface SpecCell {
  text: string
  detail?: string
  /** Ahead of at least one other car, and behind none */
  best: boolean
}

export interface SpecRow {
  key: string
  label: string
  cells: SpecCell[]
}

/** The rows a comparison shows, with a cell per car in the order given */
export const compareSpecs = (compared: ReadonlyArray<Car>): SpecRow[] =>
  Object.entries(specs)
    .filter(([, spec]) => spec.shown?.(compared) ?? true)
    .map(([key, spec]) => {
      const values = spec.value ? compared.map(spec.value) : undefined
      const largest = values ? Math.max(...values) : 0
      const winning =
        values && spec.better === 'lower' ? Math.min(...values) : largest
      // A tie all round leaves nobody ahead
      const differs = values ? new Set(values).size > 1 : false

      return {
        key,
        label: spec.label,
        cells: compared.map((car, index) => ({
          text: spec.text(car),
          detail: spec.detail?.(car),
          best: Boolean(values && differs && values[index] === winning),
        })),
      }
    })
