// Drægni rather than kWh: 10-80% is 70% of the battery, so 70% of the range
const rate = (timeToCharge10T080: number, range: number): number =>
  (range * 0.7) / timeToCharge10T080

/** Three significant figures, which is the precision the figure is quoted at */
const getKmPerMinutesCharged = (
  timeToCharge10T080: number,
  range: number,
): number => Number(rate(timeToCharge10T080, range).toPrecision(3))

/** The same figure as the list UI writes it, trailing zeroes and all */
export const formatKmPerMinutesCharged = (
  timeToCharge10T080: number,
  range: number,
): string => rate(timeToCharge10T080, range).toPrecision(3)

export default getKmPerMinutesCharged
