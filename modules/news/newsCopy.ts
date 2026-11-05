import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { listNames } from '@/modules/copy/listNames'
import { agree } from '@/modules/copy/plural'
import type { NewsDay, NewsItem } from './news'

// Every word here agrees with bíll, which is what each of them is about

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

const fell = ({ from = 0, to }: { from?: number; to: number }) => to < from

/** A day's news in a line, told by the biggest of it: a new car first */
export const dayHeadline = (day: NewsDay, nameOf: NameOf): string => {
  const { added, price, delivery, removed } = day.items

  if (added.length > 0) {
    const names = namesOf(added, nameOf)
    return `${someNames(names)} ${agree(names.length, 'bætist', 'bætast')} við`
  }
  if (price.length > 0) {
    const cars = new Set(price.map(({ slug }) => slug)).size
    const [only] = price
    if (cars === 1 && only?.price) {
      return `Verð á ${nameOf(only)} ${fell(only.price) ? 'lækkar' : 'hækkar'}`
    }
    return `Verðbreytingar á ${cars} ${agree(cars, 'bíl', 'bílum')}`
  }
  if (delivery.length > 0) {
    const names = namesOf(delivery, nameOf)
    return delivery.every((item) => !item.delivery?.to)
      ? `${someNames(names)} ${agree(names.length, 'kominn', 'komnir')} í sölu`
      : `Breytt afhending á ${someNames(names)}`
  }
  const names = namesOf(removed, nameOf)
  return `${someNames(names)} ${agree(names.length, 'hættir', 'hætta')} í sölu`
}

/** Everything a day brought, counted, as "2 nýir bílar og 5 verðbreytingar." */
export const daySummary = ({ items }: NewsDay): string => {
  const count = (n: number, singular: string, plural: string) =>
    n > 0 ? [`${n} ${agree(n, singular, plural)}`] : []

  return `${listNames([
    ...count(items.added.length, 'nýr bíll', 'nýir bílar'),
    ...count(items.price.length, 'verðbreyting', 'verðbreytingar'),
    ...count(
      items.delivery.length,
      'breyting á afhendingu',
      'breytingar á afhendingu',
    ),
    ...count(items.removed.length, 'hættir í sölu', 'hætta í sölu'),
  ])}.`
}

const priceVerbs = {
  fell: { news: 'lækkar', history: 'lækkaði' },
  rose: { news: 'hækkar', history: 'hækkaði' },
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
      const start = news ? 'Nýr á lista' : 'Kom á listann'
      if (delivery?.to) return `${start}, væntanlegur ${when(delivery.to)}`
      return price && !news ? `${start}, listaverð ${kr(price.to)}` : start
    }
    case 'price': {
      if (!price) return ''
      const verb = fell(price) ? priceVerbs.fell[told] : priceVerbs.rose[told]
      return `Listaverð ${verb} úr ${kr(price.from ?? 0)} í ${kr(price.to)}`
    }
    case 'delivery':
      if (!delivery?.to) return news ? 'Kominn í sölu' : 'Kom í sölu'
      if (!delivery.from) return `Væntanlegur ${when(delivery.to)}`
      return `Afhending ${news ? 'færist' : 'færðist'}: ${when(delivery.from)} → ${when(delivery.to)}`
    case 'removed':
      return news ? 'Hættur í sölu' : 'Hætti í sölu'
    case 'renamed':
      return `Hét áður ${item.renamedFrom}`
  }
}
