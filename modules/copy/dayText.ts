const months = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

// Spelled out here rather than by Intl, which would read the runtime's locale
/** A day as 2026-10-31 written as Icelandic sets it out: "31. október 2026" */
export const dayText = (date: string): string => {
  const [year, month = 1, day] = date.split('-').map(Number)
  return `${day}. ${months[month - 1]} ${year}`
}

/** The month a day is in, as "október 2026" */
export const monthText = (date: string): string =>
  dayText(date).replace(/^\d+\. /, '')

/**
 * The days from one to another, saying the month and year once where they
 * share them: "4.–17. desember 2023", "20. nóvember – 17. desember 2023"
 */
export const dayRangeText = (from: string, to: string): string => {
  if (from === to) return dayText(to)
  const [first, last] = [dayText(from), dayText(to)]
  if (from.slice(0, 7) === to.slice(0, 7)) {
    return `${first.split(' ')[0]}–${last}`
  }
  if (from.slice(0, 4) === to.slice(0, 4)) {
    return `${first.replace(/ \d+$/, '')} – ${last}`
  }
  return `${first} – ${last}`
}
