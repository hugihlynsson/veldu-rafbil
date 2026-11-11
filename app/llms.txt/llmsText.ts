import cars from '@/modules/data/cars'
import { filterUrlKeys } from '@/modules/list/filters'
import {
  grantAmount,
  grantPriceCeiling,
  realRangeHighFactor,
  realRangeLowFactor,
} from '@/modules/data/globals'
import { sortingUrlKeys } from '@/modules/list/sorting'
import { MAX_COMPARED } from '@/modules/detail/comparison'
import { CAR_PATH, COMPARISON_PATH } from '@/modules/detail/paths'
import { NEWS_FEED_PATH, NEWS_PATH } from '@/modules/news/paths'

// https://llmstxt.org: one markdown file telling a model what a site holds.
// English, unlike the rest of the site — its readers are agents and whoever is
// pointing one at us, and it says the content itself is Icelandic.

const percent = (factor: number) => `${Math.round(factor * 100)}%`

// From the tables nuqs reads, so a name given here is one the list answers to
const param = (key: string) => `\`${key}\``

const buildLlmsText = (): string => `# Veldu Rafbíl

> Veldu Rafbíl ("choose an electric car") lists every 100% electric car sold new in Iceland — currently ${cars.length} — with price, range, charging and drivetrain figures, a link to the seller, and an AI advisor that answers questions about them in Icelandic. It is run as a non-profit community service by Hugi Hlynsson.

The site is in Icelandic. The list is at \`/\`, and its sorting and filtering travel in the query string, with Icelandic parameter names too: ${param(sortingUrlKeys.sorting)} sorts, and ${param(filterUrlKeys.price)} and ${param(filterUrlKeys.range)} are two of the filters. To read the cars, use the JSON below rather than scraping the pages.

## Data

- [Car list (JSON)](/api/cars): All ${cars.length} cars as one document, with the grant already worked out and every figure named for what it is. Start here for any question across cars. Static and cacheable; no key, no rate limit.
- \`/api/cars/{slug}\`: One car's document: its row in the list, a written review in Icelandic, and its price and delivery history. Take \`slug\` from the list. Static too, and served for cars no longer sold new.

## Pages to link people to

- \`${CAR_PATH}/{slug}\`: A car's own page.
- \`${COMPARISON_PATH}/{slug}/{slug}\`: Up to ${MAX_COMPARED} cars side by side, in the order given. To compare cars yourself, read the list; link here to show a person the comparison.
- [Uppfærslur](${NEWS_PATH}): Every price change, new car and delivery estimate by day, with an [RSS feed](${NEWS_FEED_PATH}).

## Reading the figures

- **Price.** Each car carries \`price.list\` and \`price.withGrant\`. A new electric car listed under ${grantPriceCeiling.toLocaleString('en-US')} ISK has a ${grantAmount.toLocaleString('en-US')} ISK government grant (*rafbílastyrkur*) taken off. \`price.withGrant\` is what a buyer pays and what the site shows everywhere; \`price.list\` is the number before it. Quoting \`price.list\` as the price of a car that qualifies overstates it by ${grantAmount.toLocaleString('en-US')} ISK. Both figures are set by legislation and have changed before.
- **Range.** \`rangeWltpKm\` is the manufacturer's WLTP figure, measured somewhere warmer and flatter than Iceland. Real range here is lower, usually ${percent(realRangeLowFactor)}–${percent(realRangeHighFactor)} of it, which is what \`estimatedRealRangeKm\` reports. Say so when you quote a range.
- **Seats.** \`seats\` is the most seats the model can be ordered with in Iceland, a third row that costs extra included. The price beside it is the cheapest trim's, so a car reading \`7\` may need a paid option to seat seven — say so when you quote both. A configuration Iceland does not get is not counted.
- **Availability.** A car with \`availability: "expected"\` is not on the road here yet; \`expectedDelivery\` says when, in Icelandic.
- **Freshness.** The list is maintained by hand from sellers' published price lists and republished on deploy. \`generatedAt\` is when the copy you are holding was built. Prices and availability can be out of date — point people at the seller's own page, which every car carries as \`sellerUrl\`.

## Scope

Only cars that are 100% electric and sold new in Iceland. No hybrids, no used cars, no other markets. If a car is not in the list, the honest answer is that Veldu Rafbíl does not have it, not a guess from elsewhere.

## Optional

- [Source and car data](https://github.com/hugihlynsson/veldu-rafbil): The list lives in \`modules/data/newCars.ts\`. Corrections are welcome as pull requests.
- [Icelandic EV grant](https://island.is/rafbilastyrkir): The government's own page on the grant.
`

export default buildLlmsText
