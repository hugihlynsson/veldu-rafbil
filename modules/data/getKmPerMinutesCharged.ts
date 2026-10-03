// Drægni rather than kWh: 10-80% is 70% of the battery, so 70% of the range
export const chargeWindowShare = 0.8 - 0.1

const rate = (timeToCharge10To80: number, range: number): number =>
  (range * chargeWindowShare) / timeToCharge10To80

/** Three significant figures, which is the precision the figure is quoted at */
const getKmPerMinutesCharged = (
  timeToCharge10To80: number,
  range: number,
): number => Number(rate(timeToCharge10To80, range).toPrecision(3))

/** The same figure as the list UI writes it, trailing zeroes and all */
export const formatKmPerMinutesCharged = (
  timeToCharge10To80: number,
  range: number,
): string => rate(timeToCharge10To80, range).toPrecision(3)

export default getKmPerMinutesCharged
