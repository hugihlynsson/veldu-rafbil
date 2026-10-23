import type { Car } from '@/modules/data/cars'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { driveLabels } from '@/modules/data/drives'
import { formatKmPerMinute } from '@/modules/data/getKmPerMinutesCharged'
import { toHorsepower } from '@/modules/data/horsepower'

interface Spec {
  label: string
  /** Which end wins, for a figure where one does */
  better?: 'higher' | 'lower'
  value?: (car: Car) => number
  text: (car: Car) => string
  detail?: (car: Car) => string | undefined
}

const specs = {
  price: {
    label: 'Verð',
    better: 'lower',
    value: (car) => car.priceWithGrant,
    text: (car) => `${addDecimalSeparators(car.priceWithGrant)} kr.`,
    // What the list's price pill says in its badge, which a column has no room for
    detail: (car) =>
      [
        car.expectedDelivery && 'áætlað verð',
        car.deprecated && 'síðasta verð',
        car.hasGrant && 'með styrk',
      ]
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
    label: 'Hröðun',
    better: 'lower',
    value: (car) => car.acceleration,
    text: (car) => `${car.acceleration.toFixed(1)}s`,
    detail: () => '0-100 km/klst',
  },
  power: {
    label: 'Afl',
    better: 'higher',
    value: (car) => car.power,
    text: (car) => `${car.power} kW`,
    detail: (car) => `${toHorsepower(car.power)} hö`,
  },
  // Not ranked: which wheels are driven is a need, not a score. The code as
  // the figure, as on the list's card, since the name outgrows a phone's column
  drive: {
    label: 'Drif',
    text: (car) => car.drive,
    detail: (car) => driveLabels[car.drive],
  },
  // Not ranked: a seventh seat is no use to most, and costs extra. The most
  // the car can be ordered with, as everywhere on the site.
  seats: {
    label: 'Sæti',
    text: (car) => String(car.seats),
  },
} satisfies Record<string, Spec>

export interface SpecCell {
  text: string
  detail?: string
  /** Ahead of at least one other car, and behind none */
  best: boolean
}

export type SpecKey = keyof typeof specs

export interface SpecRow {
  key: SpecKey
  label: string
  cells: SpecCell[]
}

/** The rows of figures for these cars, with a cell for each in their order */
export const specRows = (compared: ReadonlyArray<Car>): SpecRow[] =>
  (Object.entries(specs) as Array<[SpecKey, Spec]>).map(([key, spec]) => {
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
