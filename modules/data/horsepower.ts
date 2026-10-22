// Metric horsepower (PS), the figure sellers in Iceland quote as hestöfl,
// rather than the imperial hp, which is about 1.4% lower
const psPerKw = 1.35962

export const toHorsepower = (kW: number): number => Math.round(kW * psPerKw)
