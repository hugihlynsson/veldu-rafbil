const getKmPerMinutesCharged = (timeToCharge10T080: number, range: number) =>
  ((range * 0.7) / timeToCharge10T080).toPrecision(3)

export default getKmPerMinutesCharged
