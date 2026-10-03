import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { filterKeys, type FilterKey, type Filters } from './filters'

export type ChipText = {
  label: string
  /** The value as the chip shows it, arrow included */
  value: string
  /** The whole button's label, since the visible text alone reads as a fragment */
  removeLabel: string
}

// Written out one by one because the aria-label needs the Icelandic case after
// "Fjarlægja". Mapped over `Filters`, so a new filter has to be given a chip
// before it compiles, and a filter on the page can always be switched off.
const chipText: {
  [Key in keyof Filters]-?: (value: NonNullable<Filters[Key]>) => ChipText
} = {
  name: (names) => ({
    label: 'Nafn:',
    value: names.join(', '),
    removeLabel: `Fjarlægja nafnasíu: ${names.join(', ')}`,
  }),
  price: (max) => {
    const price = addDecimalSeparators(max)
    return {
      label: 'Verð:',
      value: `↓${price} kr.`,
      removeLabel: `Fjarlægja verðsíu: hámark ${price} kr.`,
    }
  },
  range: (min) => ({
    label: 'Drægni:',
    value: `↑${min} km.`,
    removeLabel: `Fjarlægja drægnisíu: lágmark ${min} km`,
  }),
  seats: (min) => ({
    label: 'Sæti:',
    value: `${min}+`,
    removeLabel: `Fjarlægja sætasíu: lágmark ${min} sæti`,
  }),
  drive: (drives) => ({
    label: 'Drif:',
    value: drives.join(', '),
    removeLabel: `Fjarlægja drifsíu: ${drives.join(', ')}`,
  }),
  acceleration: (max) => {
    const seconds = max.toFixed(1)
    return {
      // The only one without a colon, as it has always read
      label: 'Hröðun',
      value: `↓${seconds}s`,
      removeLabel: `Fjarlægja hröðunarsíu: hámark ${seconds} sekúndur`,
    }
  },
  value: (max) => {
    const value = addDecimalSeparators(max)
    return {
      label: 'Verði á km:',
      value: `↓${value} kr.`,
      removeLabel: `Fjarlægja síu á verði á km: hámark ${value} kr.`,
    }
  },
  fastcharge: (min) => ({
    label: 'Hraðhleðsla:',
    value: `↑${min} km/min`,
    removeLabel: `Fjarlægja hraðhleðslusíu: lágmark ${min} km á mínútu`,
  }),
  availability: (availability) => {
    const isAvailable = availability === 'available'
    return {
      label: 'Framboð:',
      value: isAvailable ? 'Fáanlegir' : 'Væntanlegir',
      removeLabel: `Fjarlægja framboðssíu: ${
        isAvailable ? 'fáanlegir' : 'væntanlegir'
      }`,
    }
  },
}

/** How a filter reads on a chip, applied or suggested */
export const filterChipText = <Key extends FilterKey>(
  name: Key,
  value: NonNullable<Filters[Key]>,
): ChipText => (chipText[name] as (value: unknown) => ChipText)(value)

/** The chips for the filters set, in their order whatever order they came in */
export const activeChips = (filters: Filters) =>
  filterKeys.flatMap((name) => {
    const value = filters[name]
    if (value === undefined) return []
    return [{ name, ...filterChipText(name, value) }]
  })
