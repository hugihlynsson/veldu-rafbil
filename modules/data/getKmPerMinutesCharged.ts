// Drægni rather than kWh: 10-80% is 70% of the battery, so 70% of the range
export const chargeWindowShare = 0.8 - 0.1

/** Three significant figures, which is the precision the figure is quoted at */
const getKmPerMinutesCharged = (
  timeToCharge10To80: number,
  range: number,
): number =>
  Number(((range * chargeWindowShare) / timeToCharge10To80).toPrecision(3))

/** The figure as the list UI writes it, trailing zeroes and all */
export const formatKmPerMinute = (kmPerMinute: number): string =>
  kmPerMinute.toPrecision(3)

export default getKmPerMinutesCharged
