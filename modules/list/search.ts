import type { Car } from '@/modules/data/cars'
import { driveLabels } from '@/modules/data/drives'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { agree } from '@/modules/copy/plural'
import { bodyTypeLabels } from './bodyTypes'
import {
  fieldsFromFilters,
  filterKeys,
  normalizeFilters,
  type FilterKey,
  type Filters,
  type FilterValue,
} from './filters'
import { sortCars, type SortingState } from './sorting'

/** Krónur as the search writes a budget: "8 m.kr", "6,5 m.kr" */
export const millionsText = (kronur: number): string =>
  `${String(Math.round(kronur / 100_000) / 10).replace('.', ',')} m.kr`

const sameFilters = (a: Filters, b: Filters): boolean =>
  JSON.stringify(fieldsFromFilters(normalizeFilters(a))) ===
  JSON.stringify(fieldsFromFilters(normalizeFilters(b)))

/**
 * The budgets offered as steps, cut from the prices so they move with the
 * list: where a quarter, half, three quarters and nine tenths of the cars come
 * in under, each rounded up to the half million a buyer would say.
 */
export const pricePresets = (list: ReadonlyArray<Car>): number[] => {
  const prices = sortCars(list, 'price', 'asc').map((car) => car.priceWithGrant)
  if (prices.length === 0) return []
  const steps = [0.25, 0.5, 0.75, 0.9].map((share) => {
    const price =
      prices[Math.min(prices.length - 1, Math.floor(share * prices.length))]!
    return Math.ceil(price / 500_000) * 500_000
  })
  return [...new Set(steps)]
}

export interface Preset {
  id: string
  label: string
  filters: Filters
  sorting: SortingState
}

const byPrice: SortingState = { sorting: 'price', direction: 'asc' }

/**
 * A way into the list for someone who does not yet know what to ask for. Each
 * replaces the search, as a category does, and is only a set of filters and a
 * sorting, so it is a link like any other once applied.
 */
export const presets = (list: ReadonlyArray<Car>): Preset[] => [
  {
    id: 'family',
    label: 'Fjölskyldubílar',
    filters: { body: ['compactSuv', 'suv', 'estate', 'van'], range: 400 },
    sorting: byPrice,
  },
  {
    id: 'suv',
    label: 'Jeppar',
    filters: { body: ['suv'], drive: ['AWD'] },
    sorting: byPrice,
  },
  {
    id: 'cheapest',
    label: 'Ódýrastir',
    filters: { price: pricePresets(list)[0] },
    sorting: byPrice,
  },
  {
    id: 'range',
    label: 'Lengsta drægni',
    filters: {},
    sorting: { sorting: 'range', direction: 'desc' },
  },
  {
    id: 'towing',
    label: 'Dregur hjólhýsi',
    filters: { towing: 1500 },
    sorting: byPrice,
  },
  {
    id: 'available',
    label: 'Fáanlegir strax',
    filters: { availability: 'available' },
    sorting: byPrice,
  },
]

export const presetMatches = (
  preset: Preset,
  filters: Filters,
  sorting: SortingState,
): boolean =>
  sameFilters(preset.filters, filters) &&
  preset.sorting.sorting === sorting.sorting &&
  preset.sorting.direction === sorting.direction

export type QuickToggle = {
  [Key in FilterKey]: { key: Key; value: FilterValue<Key>; label: string }
}[FilterKey]

/** One tap each, beside the search, for the asks that come after the big three */
export const quickToggles: QuickToggle[] = [
  { key: 'range', value: 400, label: 'Drægni 400+ km' },
  {
    key: 'towing',
    value: 1500,
    label: `Dráttargeta ${addDecimalSeparators(1500)}+ kg`,
  },
  { key: 'seats', value: 7, label: '7 sæta' },
  { key: 'groundClearance', value: 180, label: 'Veghæð 180+ mm' },
]

export const quickToggleOn = (toggle: QuickToggle, filters: Filters): boolean =>
  filters[toggle.key] === toggle.value

/** The filters with the toggle flipped, the rest left as they were */
export const toggledQuick = (
  toggle: QuickToggle,
  filters: Filters,
): Filters => {
  const next: Filters = { ...filters }
  if (quickToggleOn(toggle, filters)) delete next[toggle.key]
  else (next as Record<FilterKey, unknown>)[toggle.key] = toggle.value
  return next
}

const listText = (
  values: ReadonlyArray<string>,
  many: (count: number) => string,
) => (values.length <= 2 ? values.join(', ') : many(values.length))

/** What the text field holds, as the bar shows it */
export const textSummary = (filters: Filters): string | undefined => {
  const parts = [
    ...(filters.make ? [listText(filters.make, (n) => `${n} merki`)] : []),
    ...(filters.name ? [listText(filters.name, (n) => `${n} nöfn`)] : []),
  ]
  return parts.length ? parts.join(', ') : undefined
}

export const priceSummary = (filters: Filters): string | undefined =>
  filters.price === undefined
    ? undefined
    : `Undir ${millionsText(filters.price)}`

export const bodySummary = (filters: Filters): string | undefined =>
  filters.body &&
  listText(
    filters.body.map((type) => bodyTypeLabels[type]),
    (n) => agree(n, `${n} gerð`, `${n} gerðir`),
  )

export const driveSummary = (filters: Filters): string | undefined =>
  filters.drive?.map((drive) => driveLabels[drive]).join(', ')

// The four the bar has a place for; the rest it counts
const summarised: FilterKey[] = ['make', 'name', 'price', 'body', 'drive']

/**
 * The search in a line, as the bar stuck to the top of the page reads it back:
 * "Undir 8 m.kr · Jeppi · Fjórhjóladrif · +1 sía". Empty with no filter set.
 */
export const searchSummary = (filters: Filters): string[] => {
  const rest = filterKeys.filter(
    (key) => filters[key] !== undefined && !summarised.includes(key),
  ).length
  return [
    textSummary(filters),
    priceSummary(filters),
    bodySummary(filters),
    driveSummary(filters),
    rest > 0 ? `+${rest} ${agree(rest, 'sía', 'síur')}` : undefined,
  ].filter((part): part is string => part !== undefined)
}
