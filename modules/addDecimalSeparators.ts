// Icelandic number formatting, by hand because number.toLocaleString() can be
// inconsistent between node and the client and break SSR.
//
// Grouping is by thousands with a full stop, and the decimal separator is a
// comma: 9.500.000,5. The fractional half is not theoretical — the price and
// price-per-km filters come out of the URL, where a shared or hand-edited link
// can carry one, and the old reverse-and-chunk version turned 9500000.5 into
// "950.000.0.5" in the chip that offers to remove the filter, and read the same
// out to a screen reader.
const addDecimalSeparators = (value: number): string => {
  // Past 1e21 toString() gives exponential form, which has nothing to group,
  // and a NaN or an Infinity has nothing to say either
  if (!Number.isFinite(value) || Math.abs(value) >= 1e21) return String(value)

  const [whole, fraction] = Math.abs(value).toString().split('.')

  // A separator goes between digits wherever a whole number of groups of three
  // follows: 1234567 -> 1.234.567
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${value < 0 ? '-' : ''}${grouped}${fraction ? `,${fraction}` : ''}`
}

export default addDecimalSeparators
