import type { Car } from '@/modules/data/cars'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** Whether the model read the ev-database page of every car that has one */
export const readEveryPage = (
  compared: ReadonlyArray<Car>,
  read: ReadonlySet<string>,
): boolean => compared.every((car) => !car.evDatabaseUrl || read.has(car.label))

/**
 * Where a verdict is kept. One written from every page lasts as long as its
 * figures; one written without some, as when ev-database turns the server
 * away, says nothing of size or towing, so it is kept only for the week it was
 * written in and written afresh after.
 */
export const verdictKeys = (key: string, now = Date.now()) => ({
  whole: key,
  partial: `${key}:week-${Math.floor(now / WEEK_MS)}`,
})
