// Export Firebase Database and store it in this folder.
// It should be named "choose-ev-export.json"
// Then run `node scripts/TM3LRperDay.mjs` to get some results ✨

import { readFile } from 'fs/promises'

const data = JSON.parse(
  await readFile(new URL('./choose-ev-export.json', import.meta.url)),
)

const formatDate = (date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

const dates = Object.values(data.snapshots).map((snapshot) =>
  formatDate(new Date(snapshot.timestamp)),
)
const uniqueDates = Array.from(new Set(dates))
const uniqueDateSnapshots = uniqueDates.map((date) =>
  Object.values(data.snapshots).find(
    (snapshot) => date === formatDate(new Date(snapshot.timestamp)),
  ),
)

const counts = uniqueDateSnapshots.map((snapshot) => {
  const tm3lrs = snapshot.cars.filter((car) =>
    Boolean(car.metadata?.id == 'tesla-model-3-long-range'),
  )

  const date = formatDate(new Date(snapshot.timestamp))
  return `${date}\t${tm3lrs.length}`
})

console.log(counts.join('\n '))
// console.log(JSON.stringify(counts, null, 2))
