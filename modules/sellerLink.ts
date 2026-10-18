// What the seller's own analytics see a visit from here as. Only the link a
// visitor follows carries it; /api/cars and llms.txt publish the page as it is.
const referral = { utm_source: 'veldurafbil', utm_medium: 'referral' }

/**
 * A seller's page as linked from the list, tagged so the seller can count the
 * buyers sent their way. A tag the page already has is left as it is.
 */
export const sellerLink = (sellerUrl: string): string => {
  let url: URL
  try {
    url = new URL(sellerUrl)
  } catch {
    return sellerUrl
  }
  for (const [key, value] of Object.entries(referral)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value)
  }
  return url.href
}
