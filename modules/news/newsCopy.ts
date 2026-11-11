import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { listNames } from '@/modules/copy/listNames'
import { agree } from '@/modules/copy/plural'
import type { DayKind, NewsDay, NewsItem } from './news'

// Every word here agrees with bíll, which is what each of them is about

// A heading is read without its count beside it, so 21 cars take the plural
// as any number of cars but one does, not the singular a stated 21 would
const kindLabels: Record<DayKind, [singular: string, plural: string]> = {
  added: ['Nýr á lista', 'Nýir á lista'],
  price: ['Verðbreyting', 'Verðbreytingar'],
  estimate: ['Nýtt áætlað verð', 'Nýtt áætlað verð'],
  delivery: ['Afhending', 'Afhending'],
  removed: ['Hættur í sölu', 'Hættir í sölu'],
}

/** The heading a day's news of a kind goes under, on its page and in the feed */
export const kindLabel = (kind: DayKind, count: number): string =>
  kindLabels[kind][count === 1 ? 0 : 1]

// What the log keeps is the list price, as the grant on a past day is not
// kept, so the heading over the prices calls it what a car's history does
export const priceNote = 'listaverð án styrks'

/** Whether the heading over a kind takes the note on which price it gives */
export const notesPrice = (kind: DayKind): boolean =>
  kind === 'price' || kind === 'estimate'

/** What a headline calls the car an item is about, its variants as one */
export type NameOf = (item: NewsItem) => string

const kr = (amount: number) => `${addDecimalSeparators(amount)} kr.`

const someNames = (names: ReadonlyArray<string>) =>
  names.length <= 3
    ? listNames(names)
    : `${names.slice(0, 2).join(', ')} og ${names.length - 2} fleiri`

const namesOf = (items: ReadonlyArray<NewsItem>, nameOf: NameOf) => [
  ...new Set(items.map(nameOf)),
]

// As the comparison sets it: "Væntanlegur lok 2026"
const when = (delivery: string) => delivery.toLowerCase()

// Names joined with "og" take a plural verb however many there are, so this
// is not agree(), which reads the singular in 21 or 31 as Icelandic counts do
const verb = (names: ReadonlyArray<string>, singular: string, plural: string) =>
  names.length === 1 ? singular : plural

const fell = ({ from = 0, to }: { from?: number; to: number }) => to < from

/** A day's news in a line, told by the biggest of it: a new car first */
export const dayHeadline = (day: NewsDay, nameOf: NameOf): string => {
  const { added, price, estimate, delivery, removed } = day.items

  if (added.length > 0) {
    const names = namesOf(added, nameOf)
    return `${someNames(names)} ${verb(names, 'bætist', 'bætast')} við`
  }
  if (price.length > 0) {
    const cars = new Set(price.map(({ slug }) => slug)).size
    const [only] = price
    if (cars === 1 && only?.price) {
      return `Verð á ${nameOf(only)} ${fell(only.price) ? 'lækkar' : 'hækkar'}`
    }
    return `Verðbreytingar á ${cars} ${agree(cars, 'bíl', 'bílum')}`
  }
  if (estimate.length > 0) {
    const cars = new Set(estimate.map(({ slug }) => slug)).size
    const [only] = estimate
    if (cars === 1 && only?.price) {
      return `Áætlað verð á ${nameOf(only)} ${fell(only.price) ? 'lækkar' : 'hækkar'}`
    }
    return `Nýtt áætlað verð á ${cars} ${agree(cars, 'bíl', 'bílum')}`
  }
  if (delivery.length > 0) {
    const names = namesOf(delivery, nameOf)
    return delivery.every((item) => !item.delivery?.to)
      ? `${someNames(names)} ${verb(names, 'kominn', 'komnir')} í sölu`
      : `Breytt afhending á ${someNames(names)}`
  }
  const names = namesOf(removed, nameOf)
  return `${someNames(names)} ${verb(names, 'hættir', 'hætta')} í sölu`
}

/** Everything a day brought, counted, as "2 nýir bílar og 5 verðbreytingar." */
export const daySummary = ({ items }: NewsDay): string => {
  const count = (n: number, singular: string, plural: string) =>
    n > 0 ? [`${n} ${agree(n, singular, plural)}`] : []

  return `${listNames([
    ...count(items.added.length, 'nýr bíll', 'nýir bílar'),
    ...count(items.price.length, 'verðbreyting', 'verðbreytingar'),
    ...count(
      items.estimate.length,
      'breyting á áætluðu verði',
      'breytingar á áætluðu verði',
    ),
    ...count(
      items.delivery.length,
      'breyting á afhendingu',
      'breytingar á afhendingu',
    ),
    ...count(items.removed.length, 'hættir í sölu', 'hætta í sölu'),
  ])}.`
}

/**
 * What happened to the car, beside its name: as news on the day, or looking
 * back from its own page
 */
export const itemText = (item: NewsItem, told: 'news' | 'history'): string => {
  const news = told === 'news'
  const { price, delivery } = item

  switch (item.kind) {
    case 'added': {
      const start = news ? 'Nýr á lista' : 'Skráður'
      if (delivery?.to) return `${start}, væntanlegur ${when(delivery.to)}`
      return price && !news ? `${start}, listaverð ${kr(price.to)}` : start
    }
    case 'price':
    case 'estimate': {
      if (!price) return ''
      const { from = 0, to } = price
      if (news) {
        // An arrow rather than "Lækkaði um", so a row of figures fits a
        // third of the page on one line
        const arrow = fell(price) ? '↓' : '↑'
        return `${kr(to)} · ${arrow} ${addDecimalSeparators(Math.abs(to - from))}`
      }
      const verb = fell(price) ? 'lækkaði' : 'hækkaði'
      const what = item.kind === 'estimate' ? 'Áætlað listaverð' : 'Listaverð'
      return `${what} ${verb} í ${addDecimalSeparators(to)} kr, um ${addDecimalSeparators(Math.abs(to - from))}`
    }
    case 'delivery':
      if (!delivery?.to) return news ? 'Kominn í sölu' : 'Kom í sölu'
      // The news is under a heading that says the delivery changed, so it
      // gives only when the car is expected now. Its history tells both
      if (!delivery.from || news) return `Væntanlegur ${when(delivery.to)}`
      return `Afhending færðist: ${when(delivery.from)} → ${when(delivery.to)}`
    case 'removed':
      return news ? 'Hættur í sölu' : 'Hætti í sölu'
    case 'renamed':
      return `Hét áður ${item.renamedFrom}`
  }
}
