/**
 * Looks cars up on ev-database's front page, which has kept answering while
 * its car pages answered 429 for weeks: each car's exact page URL, its
 * figures and its German, Dutch and UK prices, all in one request.
 *
 *   npx tsx scripts/ev-database-list.ts "Kia EV2" "Hyundai"   every car whose name has every word of one
 *   npx tsx scripts/ev-database-list.ts 3491                  the car with that id
 *
 * The list has no WLTP range, power, nominal battery or 10-80% time; the
 * update-new-cars skill says where those come from instead.
 */
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import { fetchList, findInList, type ListRow } from './evDatabaseList'

const queries = process.argv.slice(2)
if (queries.length === 0) {
  throw new Error('Name a car to look up, as "Kia EV2" or its id on the site')
}

const describe = (row: ListRow): string => {
  const { specs, prices } = row
  const figures = [
    row.drive,
    row.seats && `${row.seats} seats (European)`,
    row.acceleration && `0-100 in ${row.acceleration} s`,
    row.usableBattery && `${row.usableBattery} kWh usable`,
    row.fastcharge && `10-80% at ${row.fastcharge} kW on average`,
    specs.carBody,
    specs.segment,
    specs.cargoVolume && `${specs.cargoVolume} boot with frunk`,
    specs.towHitch === 'No'
      ? 'no towbar'
      : specs.towingBraked && `tows ${specs.towingBraked} braked`,
  ].filter(Boolean)
  const priced = Object.entries(prices).map(
    ([country, { price, status }]) =>
      `${price} ${country.toUpperCase()}${status === 'current' ? '' : ` (${status})`}`,
  )
  return [
    `${row.name}  ${row.url}`,
    `  ${row.availability ?? 'no availability given'}`,
    `  ${figures.join(', ')}`,
    `  ${priced.join(' · ') || 'no price'}`,
    row.realRange &&
      `  ${addDecimalSeparators(row.realRange)} km real-world range (not WLTP)`,
  ]
    .filter(Boolean)
    .join('\n')
}

// Not a top-level await, which tsx runs this module without
const main = async () => {
  const read = await fetchList()
  if ('error' in read) throw new Error(`Could not read the list: ${read.error}`)
  for (const query of queries) {
    const found = findInList(read.list, query)
    console.log(`\n${query}: ${found.length || 'nothing'} found\n`)
    for (const row of found) console.log(`${describe(row)}\n`)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
