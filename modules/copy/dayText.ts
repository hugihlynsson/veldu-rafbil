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

/** A day without its year, as "31. október", where the year goes without saying */
export const dayMonthText = (date: string): string =>
  dayText(date).replace(/ \d+$/, '')

/** The month a day is in, as "október 2026" */
export const monthText = (date: string): string =>
  dayText(date).replace(/^\d+\. /, '')
