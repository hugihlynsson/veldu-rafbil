// Both numbers are set by legislation and have changed before, so everything
// that prices, sorts, filters or writes about the grant reads them from here.
export const grantAmount = 500_000 // In ISK
export const grantPriceCeiling = 10_000_000 // In ISK, list price, exclusive

export interface Grant {
  amount: number
  priceCeiling: number
}

export const currentGrant: Grant = {
  amount: grantAmount,
  priceCeiling: grantPriceCeiling,
}

// Reglugerð 1090/2026, for applications approved from 1 November 2026. The
// approval date decides it, and an application can only follow registration,
// so a car still to arrive is priced on this one already.
export const nextGrant: Grant = { amount: 400_000, priceCeiling: 8_000_000 }

// Real range in Iceland as a share of WLTP — cold, wind and hills. The API,
// llms.txt and the assistant all quote these, so they agree by construction.
export const realRangeLowFactor = 0.7
export const realRangeHighFactor = 0.85
