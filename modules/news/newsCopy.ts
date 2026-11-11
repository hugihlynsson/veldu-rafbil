import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { dayText } from '@/modules/copy/dayText'
import { listNames } from '@/modules/copy/listNames'
import { agree } from '@/modules/copy/plural'
import { dayKinds, type DayKind, type NewsDay, type NewsItem } from './news'

// An adjective or participle here agrees with bíll, which is what each line
// is about; a noun such as verðbreyting takes only its own number

// One string where a heading reads the same over one row and over many
const kindLabels: Record<
  DayKind,
  string | readonly [singular: string, plural: string]
> = {
  added: ['Nýr á lista', 'Nýir á lista'],
  price: ['Verðbreyting', 'Verðbreytingar'],
  estimate: 'Nýtt áætlað verð',
  delivery: 'Afhending',
  removed: ['Hættur í sölu', 'Hættir í sölu'],
}

/**
 * The heading a day's news of a kind goes under, on its page and in the feed.
 * It names the rows under it rather than following a numeral, so it is
 * singular over one row and plural over 21 — not agree(), which is for a word
 * that follows its count, as in "21 bíll".
 */
export const kindLabel = (kind: DayKind, count: number): string => {
  const label = kindLabels[kind]
  return typeof label === 'string' ? label : label[count === 1 ? 0 : 1]
}

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

// What a search result shows of a description before it cuts it off
const DESCRIPTION_LENGTH = 160

// A sentence a description tells an item in, by the car's full name
const itemSentence = (item: NewsItem, label: string): string => {
  const { price, delivery } = item
  switch (item.kind) {
    case 'added':
      if (delivery?.to)
        return `${label} bætist við, væntanlegur ${when(delivery.to)}.`
      return price
        ? `${label} bætist við, listaverð ${kr(price.to)}`
        : `${label} bætist við.`
    case 'price':
    case 'estimate': {
      if (!price) return ''
      const what = item.kind === 'estimate' ? 'Áætlað listaverð' : 'Listaverð'
      return `${what} á ${label} ${fell(price) ? 'lækkar' : 'hækkar'} í ${kr(price.to)}`
    }
    case 'delivery':
      return delivery?.to
        ? `${label} nú væntanlegur ${when(delivery.to)}.`
        : `${label} kominn í sölu.`
    case 'removed':
      return `${label} hættir í sölu.`
    case 'renamed':
      return ''
  }
}

/**
 * A day's news for a search result: its date and as much of what it brought
 * as fits, by name and price, counting the rest rather than cutting a name
 * off. The first item is told however long it is.
 */
export const dayDescription = (
  day: NewsDay,
  labelOf: (item: NewsItem) => string,
): string => {
  const sentences = dayKinds
    .flatMap((kind) => day.items[kind])
    .map((item) => itemSentence(item, labelOf(item)))
    .filter(Boolean)

  const rest = (n: number) =>
    n > 0 ? ` ${n} ${agree(n, 'breyting', 'breytingar')} til viðbótar.` : ''

  let text = `${dayText(day.date)}:`
  let told = 0
  for (const sentence of sentences) {
    const next = `${text} ${sentence}`
    const left = sentences.length - told - 1
    if (told > 0 && (next + rest(left)).length > DESCRIPTION_LENGTH) break
    text = next
    told += 1
  }
  return text + rest(sentences.length - told)
}
