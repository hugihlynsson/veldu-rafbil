import { useSyncExternalStore } from 'react'

import cars, { type Car } from '@/modules/data/cars'
import { MAX_COMPARED } from '@/modules/compare/comparison'

const STORAGE_KEY = 'veldu-rafbil-comparison'

const carsById = new Map(cars.map((car) => [car.id, car]))
const listeners = new Set<() => void>()
const none: Car[] = []

// The snapshot has to be the same array until the selection changes, or
// useSyncExternalStore renders without end
let cached: { raw: string | null; cars: Car[] } = { raw: null, cars: none }

const read = (): Car[] => {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private mode can make even reading throw
  }
  if (raw === cached.raw) return cached.cars

  let ids: unknown = []
  try {
    ids = raw ? JSON.parse(raw) : []
  } catch {}

  // A car can leave the list while it waits here
  const selected = Array.isArray(ids)
    ? ids.flatMap((id) => carsById.get(id) ?? []).slice(0, MAX_COMPARED)
    : none
  cached = { raw, cars: selected.length > 0 ? selected : none }
  return cached.cars
}

const write = (selected: ReadonlyArray<Car>) => {
  try {
    if (selected.length === 0) localStorage.removeItem(STORAGE_KEY)
    else
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(selected.map((car) => car.id)),
      )
  } catch {
    // Unstored, the selection still lasts until the page is left
    cached = { raw: null, cars: [...selected] }
  }
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  // Another tab picking a car is this tab's selection too
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Puts these cars in the tray on the list, in place of what was there */
export const setComparedCars = (selected: ReadonlyArray<Car>) =>
  write(selected.slice(0, MAX_COMPARED))

/**
 * The cars picked to compare, kept in this browser so the tray survives a
 * reload. Empty in the server's render and the hydration after it, as the
 * server has no way to know them.
 */
const useComparison = () => {
  const selected = useSyncExternalStore(subscribe, read, () => none)

  const isSelected = (car: Car) => selected.includes(car)
  const isFull = selected.length >= MAX_COMPARED

  const toggle = (car: Car) => {
    if (isSelected(car)) write(selected.filter((other) => other !== car))
    else if (!isFull) write([...selected, car])
  }

  const remove = (car: Car) => write(selected.filter((other) => other !== car))

  return { selected, isSelected, isFull, toggle, remove }
}

export default useComparison
