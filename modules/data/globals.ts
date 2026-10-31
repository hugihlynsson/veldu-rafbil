// Both numbers are set by legislation and have changed before, so everything
// that prices, sorts, filters or writes about the grant reads them from here.
// Reglugerð 1090/2026, for applications approved from 1 November 2026
export const grantAmount = 400_000 // In ISK
export const grantPriceCeiling = 8_000_000 // In ISK, list price, exclusive

// What buyers still remember, for the advisor to explain the difference
export const previousGrantAmount = 500_000 // In ISK
export const previousGrantPriceCeiling = 10_000_000 // In ISK, list price, exclusive

// Real range in Iceland as a share of WLTP — cold, wind and hills. The API,
// llms.txt and the assistant all quote these, so they agree by construction.
export const realRangeLowFactor = 0.7
export const realRangeHighFactor = 0.85
